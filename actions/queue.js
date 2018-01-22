import axios from 'axios'
import * as types from '../constants/ActionTypes'

/*
 * Creating a new queue
 */
function createQueueRequest(courseId, queue) {
  return {
    type: types.CREATE_QUEUE_REQUEST,
    courseId,
    queue,
  }
}

function createQueueSuccess(courseId, queue) {
  return {
    type: types.CREATE_QUEUE_SUCCESS,
    courseId,
    queue,
  }
}

function createQueueFailure(courseId, data) {
  return {
    type: types.CREATE_QUEUE_FAILURE,
    courseId,
    data,
  }
}

export function createQueue(courseId, queue) {
  return (dispatch) => {
    dispatch(createQueueRequest(courseId, queue))

    return axios.post(`/api/courses/${courseId}/queues`, queue)
    .then(res => dispatch(createQueueSuccess(courseId, res.data)))
    .catch(err => {
      console.error(err)
      dispatch(createQueueFailure(courseId))
    })
  }
}


/*
 * Fetch a queue
 */
function fetchQueueRequest(queueId) {
  return {
    type: types.FETCH_QUEUE_REQUEST,
    queueId,
  }
}

function fetchQueueSuccess(queueId, queue) {
  return {
    type: types.FETCH_QUEUE_SUCCESS,
    queueId,
    queue,
  }
}

function fetchQueueFailure(queueId, data) {
  return {
    type: types.FETCH_QUEUE_FAILURE,
    queueId,
    data,
  }
}

export function fetchQueue(queueId) {
  return (dispatch) => {
    dispatch(fetchQueueRequest(queueId))

    return axios.get(`/api/queues/${queueId}`)
      .then(res => dispatch(fetchQueueSuccess(queueId, res.data)))
      .catch(err => {
        console.error(err)
        dispatch(fetchQueueFailure(queueId, data))
      })
  }
}
