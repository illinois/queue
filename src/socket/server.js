const sequelizeStream = require('sequelize-stream')
const cookieParser = require('cookie-parser')

const logger = require('../util/logger')
const { sequelize, Question, User, ActiveStaff, Queue } = require('../models')
const { getUserFromJwt, getAuthzForUser } = require('../auth/util')
const {
  isUserStudent,
  filterConfidentialQueueQuestionsForUser,
} = require('../api/util')

let io = null
let queueNamespace = null

const sendInitialState = (
  queueId,
  userId,
  sendCompleteQuestionData,
  callback
) => {
  const questionPromise = Question.findAll({
    where: {
      queueId,
      dequeueTime: null,
    },
    order: [['id', 'ASC']],
  })

  const activeStaffPromise = ActiveStaff.findAll({
    where: {
      endTime: null,
      queueId,
    },
    include: [User],
  })

  Promise.all([questionPromise, activeStaffPromise]).then(results => {
    const [questionsResult, activeStaff] = results
    let questions = questionsResult.map(q => q.get({ plain: true }))

    // This is a workaround to https://github.com/sequelize/sequelize/issues/10552
    // TODO remove this once the issue is fixed in sequelize
    questions = questions.map(question => {
      if (!question.beingAnswered) {
        return question
      }
      const { answeredBy } = question
      answeredBy.name = answeredBy.preferredName || answeredBy.universityName
      return { ...question, answeredBy }
    })

    if (!sendCompleteQuestionData) {
      questions = filterConfidentialQueueQuestionsForUser(userId, questions)
    }

    callback({ questions, activeStaff })
  })
}

const handleQuestionCreate = async (id, queueId) => {
  const question = await Question.findOne({ where: { id } })
  queueNamespace.to(`queue-${queueId}`).emit('question:create', { question })
  // Public confidential queues only need to learn that a question was added
  queueNamespace
    .to(`queue-${queueId}-public`)
    .emit('question:create', { question: { id } })
}

const handleQuestionUpdate = async (id, queueId) => {
  const question = await Question.findOne({
    where: { id },
  })

  // This is a workaround to https://github.com/sequelize/sequelize/issues/10552
  // TODO remove this once the issue is fixed in sequelize
  if (question.beingAnswered) {
    const { answeredBy } = question
    answeredBy.name = answeredBy.preferredName || answeredBy.universityName
    question.answeredBy = answeredBy
  }

  // Public confidential queues don't need to know about question updates
  // However, the user that *asked* the question should in fact get this update
  queueNamespace
    .to(`queue-${queueId}`)
    .to(`queue-${queueId}-user-${question.askedById}`)
    .emit('question:update', { question })
}

const handleQuestionDelete = (id, queueId) => {
  queueNamespace
    .to(`queue-${queueId}`)
    .to(`queue-${queueId}-public`)
    .emit('question:delete', { id })
}

const handleQuestionEvent = (event, instance) => {
  switch (event) {
    case 'create':
      handleQuestionCreate(instance.id, instance.queueId)
      break
    case 'update':
      if (instance.dequeueTime !== null) {
        // Treat this as a delete
        handleQuestionDelete(instance.id, instance.queueId)
      } else {
        handleQuestionUpdate(instance.id, instance.queueId)
      }
      break
    default:
    // Do nothing
  }
}

const handleActiveStaffCreate = instance => {
  const { id } = instance
  ActiveStaff.findOne({
    where: { id },
    include: [User],
  }).then(activeStaff => {
    // TODO remove once we can fix https://github.com/illinois/queue/issues/92
    if (activeStaff === null) {
      logger.error(
        `ActiveStaff query for id ${id} returned null; original instance:`
      )
      logger.error(JSON.stringify(instance))
    } else {
      queueNamespace
        .to(`queue-${activeStaff.queueId}`)
        .to(`queue-${activeStaff.queueId}-public`)
        .emit('activeStaff:create', { id, activeStaff })
    }
  })
}

const handleActiveStaffDelete = (id, queueId) => {
  queueNamespace
    .to(`queue-${queueId}`)
    .to(`queue-${queueId}-public`)
    .emit('activeStaff:delete', { id })
}

const handleActiveStaffEvent = (event, instance) => {
  // Too lazy to do this correctly for now
  if (!('queueId' in instance)) return

  switch (event) {
    case 'create':
      handleActiveStaffCreate(instance)
      break
    case 'update':
      handleActiveStaffDelete(instance.id, instance.queueId)
      break
    default:
    // Do nothing
  }
}

const handleQueueUpdate = id => {
  Queue.findOne({ where: { id } }).then(queue => {
    queueNamespace
      .to(`queue-${id}`)
      .to(`queue-${id}-public`)
      .emit('queue:update', { id, queue })
  })
}

const handleQueueEvent = (event, instance) => {
  switch (event) {
    case 'update':
      handleQueueUpdate(instance.id)
      break
    default:
    // Do nothing
  }
}

const parseSocketCookies = () => {
  const parser = cookieParser()
  return (socket, next) => {
    parser(socket.request, null, next)
  }
}

const stream = sequelizeStream(sequelize)
stream.on('data', data => {
  const { event, instance } = data
  // Need to have isConfidential in  question?
  if (instance instanceof Question) {
    handleQuestionEvent(event, instance)
  } else if (instance instanceof ActiveStaff) {
    handleActiveStaffEvent(event, instance)
  } else if (instance instanceof Queue) {
    handleQueueEvent(event, instance)
  }
})

module.exports = newIo => {
  io = newIo

  io.use(parseSocketCookies())
  // After this middleware, you can access the current user as
  // `socket.request.user`
  io.use(async (socket, next) => {
    const jwtCookie = socket.request.cookies.jwt
    const user = await getUserFromJwt(jwtCookie)
    if (!user) {
      console.error('failed to authenticate socket')
      console.error(`jwt cookie present? ${!!jwtCookie}`)
      next(new Error('Could not authenticate socket connection'))
    } else {
      // eslint-disable-next-line no-param-reassign
      socket.request.user = user
      next()
    }
  })

  queueNamespace = io.of('/queue')
  queueNamespace.on('connection', socket => {
    socket.on('join', async (msg, callback) => {
      if ('queueId' in msg) {
        const { queueId } = msg
        const queuePromise = Queue.findOne({
          where: {
            id: queueId,
          },
        })
        const userAuthzPromise = getAuthzForUser(socket.request.user)
        const [queue, userAuthz] = await Promise.all([
          queuePromise,
          userAuthzPromise,
        ])
        const { courseId, isConfidential } = queue
        const isStudent = isUserStudent(userAuthz, courseId)
        let sendCompleteQuestionData = true
        if (isConfidential && isStudent) {
          // All users that shouldn't see confidential information are added
          // to a "public" version of the room that receives the minimum
          // possible set of information
          socket.join(`queue-${queueId}-public`)
          // Users will also join a specific room for themselves so that they
          // receive updates about questions being answered, etc.
          socket.join(`queue-${queueId}-user-${socket.request.user.id}`)
          sendCompleteQuestionData = false
        } else {
          // For non-confidential queues, this room will consider receiving all
          // updates for all users. For confidential queues, only admins and
          // course staff will be subscribed to this room
          socket.join(`queue-${queueId}`)
        }
        const { id: userId } = socket.request.user
        sendInitialState(queueId, userId, sendCompleteQuestionData, callback)
      }
    })
  })
}
