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

const handleQuestionEvent = (event, instance) => {
  // Do nothing, for now
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
