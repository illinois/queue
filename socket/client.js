import io from 'socket.io-client'
import { replaceQuestions, updateQuestion, createQuestionSuccess, deleteQuestionSuccess } from '../actions/question'
import { addQueueStaffSuccess, removeQueueStaffSuccess } from '../actions/queue'
import { replaceActiveStaff } from '../actions/activeStaff'
import { normalizeActiveStaff } from '../reducers/normalize'
import { baseUrl } from '../util'

const socketOpts = {
  path: `${baseUrl}/socket.io`,
  // TODO remove in production; this is just for testing
  transports: ['polling'],
}

const queueSockets = {}

const handleQuestionCreate = (dispatch, queueId, question) => {
  dispatch(createQuestionSuccess(queueId, question))
}

const handleQuestionUpdate = (dispatch, question) => {
  dispatch(updateQuestion(question))
}

const handleQuestionDelete = (dispatch, queueId, questionId) => {
  dispatch(deleteQuestionSuccess(queueId, questionId))
}

const handleActiveStaffCreate = (dispatch, queueId, data) => {
  const normalized = normalizeActiveStaff(data)
  const activeStaff = normalized.entities.activeStaff[normalized.result]
  dispatch(addQueueStaffSuccess(queueId, null, activeStaff, normalized))
}

const handleActiveStaffDelete = (dispatch, queueId, id) => {
  dispatch(removeQueueStaffSuccess(queueId, null, id))
}

export const connectToQueue = (dispatch, queueId) => {
  const socket = io('/queue', socketOpts)
  queueSockets[queueId] = socket
  socket.on('connect', () => {
    socket.emit('join', { queueId }, ({ questions, activeStaff }) => {
      dispatch(replaceQuestions(queueId, questions))
      dispatch(replaceActiveStaff(queueId, activeStaff))
    })
  })
  socket.on('question:create', ({ question }) => handleQuestionCreate(dispatch, queueId, question))
  socket.on('question:update', ({ question }) => handleQuestionUpdate(dispatch, queueId, question))
  socket.on('question:delete', ({ id }) => handleQuestionDelete(dispatch, queueId, id))
  socket.on('activeStaff:create', ({ activeStaff }) => handleActiveStaffCreate(dispatch, queueId, activeStaff))
  socket.on('activeStaff:delete', ({ id }) => handleActiveStaffDelete(dispatch, queueId, id))
}

export const disconnectFromQueue = (queueId) => {
  if (queueId in queueSockets) {
    queueSockets[queueId].close()
    delete queueSockets[queueId]
  }
}
