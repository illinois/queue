import io from 'socket.io-client'
import { replaceQuestions } from '../actions/question'
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
  // socket.on('questions:update', ({ questions }) => handleQuestionsUpdate(dispatch, queueId, questions))
  socket.on('activeStaff:create', ({ activeStaff }) => handleActiveStaffCreate(dispatch, queueId, activeStaff))
  socket.on('activeStaff:delete', ({ id }) => handleActiveStaffDelete(dispatch, queueId, id))
}

export const disconnectFromQueue = (queueId) => {
  if (queueId in queueSockets) {
    queueSockets[queueId].close()
    delete queueSockets[queueId]
  }
}
