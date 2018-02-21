const sequelizeStream = require('sequelize-stream')
const {
  sequelize,
  Question,
  User,
  ActiveStaff,
} = require('../models')

let io = null
let queueNamespace = null

const sendInitialState = (queueId, callback) => {
  const questionPromise = Question.findAll({
    where: {
      queueId,
      dequeueTime: null,
    },
    order: [
      ['id', 'ASC'],
    ],
  })

  const activeStaffPromise = ActiveStaff.findAll({
    where: {
      endTime: null,
      queueId,
    },
    include: [User],
  })

  Promise.all([questionPromise, activeStaffPromise]).then((results) => {
    const [questions, activeStaff] = results
    callback({ questions, activeStaff })
  })
}

const handleQuestionCreate = (id, queueId) => {
  Question.findOne({ where: { id } }).then((question) => {
    queueNamespace.to(`queue-${queueId}`).emit('question:create', { id, question })
  })
}

const handleQuestionUpdate = (id, queueId) => {
  Question.findOne({ where: { id } }).then((question) => {
    queueNamespace.to(`queue-${queueId}`).emit('question:update', { id, question })
  })
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

const handleActiveStaffCreate = (id) => {
  ActiveStaff.findOne({
    where: { id },
    include: [User],
  }).then((activeStaff) => {
    queueNamespace.to(`queue-${activeStaff.queueId}`).emit('activeStaff:create', { id, activeStaff })
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
stream.on('data', (data) => {
  const { event, instance } = data
  if (instance instanceof Question) {
    handleQuestionEvent(event, instance)
  } else if (instance instanceof ActiveStaff) {
    handleActiveStaffEvent(event, instance)
  }
})


module.exports = (newIo) => {
  io = newIo

  queueNamespace = io.of('/queue')
  queueNamespace.on('connection', (socket) => {
    socket.on('join', (msg, callback) => {
      if ('queueId' in msg) {
        const { queueId } = msg
        socket.join(`queue-${queueId}`)
        sendInitialState(queueId, callback)
      }
    })
  })
}
