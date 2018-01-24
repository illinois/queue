import io from 'socket.io-client'
import { updateQuestions } from '../actions/question'

const handleQuestionsUpdate = (dispatch, queueId, questions) => {
  dispatch(updateQuestions(queueId, questions))
}

const queueSockets = {}

export const connectToQueue = (dispatch, queueId) => {
  const socket = io('/queue')
  queueSockets[queueId] = socket
  socket.emit('join', { queueId })
  socket.on('questions:update', ({ questions }) => handleQuestionsUpdate(dispatch, queueId, questions))
}

export const disconnectFromQueue = (queueId) => {
  if (queueId in queueSockets) {
    queueSockets[queueId].close()
    delete queueSockets[queueId]
  }
}
