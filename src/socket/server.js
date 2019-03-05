const sequelizeStream = require('sequelize-stream')
const cookieParser = require('cookie-parser')

const { sequelize, Question, User, ActiveStaff, Queue } = require('../models')
const { getUserFromJwt, getAuthzForUser } = require('../auth/util')
const {
  canUserSeeQuestionDetailsForConfidentialQueue,
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
    if (!sendCompleteQuestionData) {
      questions = filterConfidentialQueueQuestionsForUser(userId, questions)
    }

    callback({ questions, activeStaff })
  })
}

const handleQuestionCreate = async (id, queueId) => {
  const question = await Question.findOne({ where: { id } })
  queueNamespace.to(`queue-${queueId}`).emit('question:create', { question })
  queueNamespace
    .to(`queue-${queueId}-public`)
    .emit('question:create', { question: { id } })
}

const handleQuestionUpdate = async (id, queueId) => {
  const question = Question.findOne({ where: { id } })
  queueNamespace.to(`queue-${queueId}`).emit('question:update', { question })
}

const handleQuestionDelete = (id, queueId) => {
  queueNamespace.to(`queue-${queueId}`).emit('question:delete', { id })
  queueNamespace.to(`queue-${queueId}-public`).emit('question:delete', { id })
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

const handleActiveStaffCreate = id => {
  ActiveStaff.findOne({
    where: { id },
    include: [User],
  }).then(activeStaff => {
    queueNamespace
      .to(`queue-${activeStaff.queueId}-staff`)
      .emit('activeStaff:create', { id, activeStaff })
  })
}

const handleActiveStaffDelete = (id, queueId) => {
  queueNamespace.to(`queue-${queueId}-staff`).emit('activeStaff:delete', { id })
}

const handleActiveStaffEvent = (event, instance) => {
  // Too lazy to do this correctly for now
  if (!('queueId' in instance)) return

  switch (event) {
    case 'create':
      handleActiveStaffCreate(instance.id)
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
    queueNamespace.to(`queue-${id}-staff`).emit('queue:update', { id, queue })
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
    const user = await getUserFromJwt(socket.request.cookies.jwt)
    // eslint-disable-next-line no-param-reassign
    socket.request.user = user
    next()
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
        const canSeeQuestionDetails = canUserSeeQuestionDetailsForConfidentialQueue(
          userAuthz,
          courseId
        )
        let sendCompleteQuestionData = true
        if (isConfidential && !canSeeQuestionDetails) {
          socket.join(`queue-${queueId}-public`)
          sendCompleteQuestionData = false
        } else {
          socket.join(`queue-${queueId}`)
        }
        const { id: userId } = socket.request.user
        sendInitialState(queueId, userId, sendCompleteQuestionData, callback)
      }
    })
  })
}
