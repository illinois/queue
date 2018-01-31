import io from 'socket.io-client'
import { updateQuestions } from '../actions/question'
import { updateQueues } from '../actions/queue'

/* Queue-scoped sockets that receive question updates */
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


/* Course-scoped sockets that receive queue updates */
const handleQueuesUpdate = (dispatch, courseId, queues) => {
  dispatch(updateQueues(courseId, queues))
}

const courseSockets = {}

export const connectToCourse = (dispatch, courseId) => {
  const socket = io('/course')
  courseSockets[courseId] = socket
  socket.emit('join', { courseId })
  socket.on('queues:update', ({ queues }) => handleQueuesUpdate(dispatch, courseId, queues))
}

export const disconnectFromCourse = (courseId) => {
  if (courseId in courseSockets) {
    courseSockets[courseId].close()
    delete courseSockets[courseId]
  }
}
