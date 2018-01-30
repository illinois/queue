const sequelizeStream = require('sequelize-stream')
const {
  sequelize,
  Question,
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

const stream = sequelizeStream(sequelize)
stream.on('data', (data) => {
  const { instance } = data
  if (instance instanceof Question) {
    // Questions changed!
    handleQuestionsUpdated(instance.queueId)
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
