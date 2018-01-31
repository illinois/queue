const sequelizeStream = require('sequelize-stream')
const {
  sequelize,
  Question,
  Queue,
  Course
} = require('../models')

let io = null
let queueNamespace = null
let courseNamespace = null

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

const handleQueuesUpdated = (courseId) => {
  Queue.findAll({
    where: {
      courseId,
    },
    order: [
      ['id', 'ASC'],
    ],
  }).then((queues) => {
    courseNamespace.to(`course-${courseId}`).emit('queues:update', { queues })
  })
}

const stream = sequelizeStream(sequelize)
stream.on('data', (data) => {
  const { instance } = data
  if (instance instanceof Question) {
    // Questions changed!
    handleQuestionsUpdated(instance.queueId)
  } else if (instance instanceof Queue) {
    // Queues changed!
    handleQueuesUpdated(instance.courseId)
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

  courseNamespace = io.of('/course')
  courseNamespace.on('connection', (socket) => {
    socket.on('join', (msg) => {
      if ('courseId' in msg) {
        socket.join(`course-${msg.courseId}`)
      }
    })
  })
}
