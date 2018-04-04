const sequelizeStream = require('sequelize-stream')
const sharedsession = require('express-socket.io-session')

const { sequelize, Question, User, ActiveStaff, Queue } = require('../models')
const authn = require('../middleware/authn').socket
const authnDev = require('../middleware/authnDev').socket
const authz = require('../middleware/authz').socket

let io = null
let session = null
let queueNamespace = null

const sendInitialState = (queueId, callback) => {
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
    const [questions, activeStaff] = results
    callback({ questions, activeStaff })
  })
}

const handleQuestionCreate = (id, queueId) => {
  const queryAndSendMessage = (model, room) => {
    model.findOne({ where: { id } }).then(question => {
      queueNamespace.to(room).emit('question:create', { id, question })
    })
  }
  queryAndSendMessage(Question, `queue-${queueId}`)
  queryAndSendMessage(Question.scope('student'), `queue-${queueId}-student`)
}

const handleQuestionUpdate = (id, queueId) => {
  const queryAndSendMessage = (model, room) => {
    model.findOne({ where: { id } }).then(question => {
      queueNamespace.to(room).emit('question:update', { id, question })
    })
  }
  queryAndSendMessage(Question, `queue-${queueId}`)
  queryAndSendMessage(Question.scope('student'), `queue-${queueId}-student`)
}

const handleQuestionDelete = (id, queueId) => {
  queueNamespace.to(`queue-${queueId}`).emit('question:delete', { id })
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
      .to(`queue-${activeStaff.queueId}`)
      .emit('activeStaff:create', { id, activeStaff })
  })
}

const handleActiveStaffDelete = (id, queueId) => {
  queueNamespace.to(`queue-${queueId}`).emit('activeStaff:delete', { id })
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

const stream = sequelizeStream(sequelize)
stream.on('data', data => {
  const { event, instance } = data
  if (instance instanceof Question) {
    handleQuestionEvent(event, instance)
  } else if (instance instanceof ActiveStaff) {
    handleActiveStaffEvent(event, instance)
  }
})

const isCourseStaff = (userAuthn, courseId) => {
  return userAuthn.isAdmin || userAuthn.staffedCourseIds.includes(courseId)
}

const queueConnect = socket => {
  socket.on('join', (msg, callback) => {
    if ('queueId' in msg) {
      const { queueId } = msg
      Queue.findById(queueId).then(queue => {
        if (isCourseStaff(socket.userAuthz, queue.courseId)) {
          socket.join(`queue-${queueId}`)
          sendInitialState(queueId, callback, true)
        } else {
          socket.join(`queue-${queueId}-student`)
          sendInitialState(queueId, callback, false)
        }
      })
    }
  })
}

module.exports = (newIo, newSession) => {
  io = newIo
  session = newSession

  const makeNamespace = name => {
    const namespace = io.of(name)
    if (session) {
      namespace.use(sharedsession(session))
      namespace.use(authnDev)
    } else {
      namespace.use(authn)
    }
    namespace.use(authz)
    return namespace
  }

  queueNamespace = makeNamespace('/queue')
  queueNamespace.on('connection', queueConnect)
}
