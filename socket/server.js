const sequelizeStream = require('sequelize-stream')
const {
  sequelize,
  Question,
  User,
  ActiveStaff,
} = require('../models')

let io = null
let queueNamespace = null

const handleQuestionsUpdated = (queueId) => {
  Question.findAll({
    where: {
      queueId,
      dequeueTime: null,
    },
    order: [
      ['id', 'ASC'],
    ],
  }).then((questions) => {
    queueNamespace.to(`queue-${queueId}`).emit('questions:update', { questions })
  })
}

const handleActiveStaffUpdated = (queueId) => {
  ActiveStaff.findAll({
    where: {
      endTime: null,
      queueId,
    },
    include: [User],
  }).then((activeStaff) => {
    queueNamespace.to(`queue-${queueId}`).emit('activeStaff:update', { activeStaff })
  })
}

const stream = sequelizeStream(sequelize)
stream.on('data', (data) => {
  const { instance } = data
  if (instance instanceof Question) {
    // Questions changed!
    if ('queueId' in instance) {
      handleQuestionsUpdated(instance.queueId)
    }
  } else if (instance instanceof ActiveStaff) {
    // Active staff changed!
    if ('queueId' in instance) {
      handleActiveStaffUpdated(instance.queueId)
    }
  }
})


module.exports = (newIo) => {
  io = newIo

  queueNamespace = io.of('/queue')
  queueNamespace.on('connection', (socket) => {
    socket.on('join', (msg) => {
      if ('queueId' in msg) {
        socket.join(`queue-${msg.queueId}`)
      }
    })
  })
}
