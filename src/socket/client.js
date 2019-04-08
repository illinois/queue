import io from 'socket.io-client'
import {
  replaceQuestions,
  createQuestionSuccess,
  updateQuestionSuccess,
  deleteQuestionSuccess,
} from '../actions/question'
import {
  addQueueStaffSuccess,
  removeQueueStaffSuccess,
  updateQueueSuccess,
} from '../actions/queue'
import { replaceActiveStaff } from '../actions/activeStaff'
import { normalizeActiveStaff } from '../reducers/normalize'
import { baseUrl } from '../util'
import { setSocketError, setSocketStatus } from '../actions/socket'
import {
  SOCKET_CONNECT_FAILED,
  SOCKET_ERROR,
  SOCKET_CONNECTING,
  SOCKET_CONNECTED,
} from '../constants/socketStatus'

const socketOpts = {
  path: `${baseUrl}/socket.io`,
}

const queueSockets = {}

const handleQuestionCreate = (dispatch, queueId, question) => {
  dispatch(createQuestionSuccess(queueId, question))
}

const handleQuestionUpdate = (dispatch, question) => {
  dispatch(updateQuestionSuccess(question.id, question))
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

const handleQueueUpdate = (dispatch, queueId, queue) => {
  dispatch(updateQueueSuccess(queueId, queue))
}

export const connectToQueue = (dispatch, queueId) => {
  console.log('connecting...')
  console.log(new Error('tracing...'))
  const socket = io('/queue', socketOpts)
  queueSockets[queueId] = socket
  socket.on('connect', () => {
    socket.emit('join', { queueId }, ({ questions, activeStaff }) => {
      dispatch(replaceQuestions(queueId, questions))
      dispatch(replaceActiveStaff(queueId, activeStaff))
    })
  })
  socket.on('connect_failed', err => {
    dispatch(setSocketStatus(SOCKET_CONNECT_FAILED))
    dispatch(setSocketError(err))
    console.error(err)
  })
  socket.on('error', err => {
    dispatch(setSocketStatus(SOCKET_ERROR))
    dispatch(setSocketError(err))
    console.error(err)
  })
  socket.on('reconnecting', () => {
    dispatch(setSocketStatus(SOCKET_CONNECTING))
    console.log('reconnecting...')
  })
  socket.on('reconnect', attempt => {
    dispatch(setSocketStatus(SOCKET_CONNECTED))
    console.log(`reconnection successful on attempt ${attempt}`)
  })
  socket.on('disconnect', () => {
    console.log('disconnected')
  })
  socket.on('connect', () => {
    dispatch(setSocketStatus(SOCKET_CONNECTED))
    console.log('connect!')
  })
  socket.on('question:create', ({ question }) =>
    handleQuestionCreate(dispatch, queueId, question)
  )
  socket.on('question:update', ({ question }) =>
    handleQuestionUpdate(dispatch, question)
  )
  socket.on('question:delete', ({ id }) =>
    handleQuestionDelete(dispatch, queueId, id)
  )
  socket.on('activeStaff:create', ({ activeStaff }) =>
    handleActiveStaffCreate(dispatch, queueId, activeStaff)
  )
  socket.on('activeStaff:delete', ({ id }) =>
    handleActiveStaffDelete(dispatch, queueId, id)
  )
  socket.on('queue:update', ({ queue }) =>
    handleQueueUpdate(dispatch, queueId, queue)
  )
}

export const disconnectFromQueue = queueId => {
  if (queueId in queueSockets) {
    queueSockets[queueId].close()
    delete queueSockets[queueId]
  }
}
