import io from 'socket.io-client'
import { updateQuestions } from '../actions/question'
import { updateActiveStaff } from '../actions/activeStaff'
import { baseUrl } from '../util'

const socketOpts = {
  path: `${baseUrl}/socket.io`,
}

/* Queue-scoped sockets that receive question updates */
const handleQuestionsUpdate = (dispatch, queueId, questions) => {
  dispatch(updateQuestions(queueId, questions))
}

const handleActiveStaffUpdate = (dispatch, queueId, activeStaff) => {
  dispatch(updateActiveStaff(queueId, activeStaff))
}

const queueSockets = {}

export const connectToQueue = (dispatch, queueId) => {
  const socket = io('/queue', socketOpts)
  queueSockets[queueId] = socket
  socket.emit('join', { queueId })
  socket.on('questions:update', ({ questions }) => handleQuestionsUpdate(dispatch, queueId, questions))
  socket.on('activeStaff:update', ({ activeStaff }) => handleActiveStaffUpdate(dispatch, queueId, activeStaff))
}

export const disconnectFromQueue = (queueId) => {
  if (queueId in queueSockets) {
    queueSockets[queueId].close()
    delete queueSockets[queueId]
  }
}
