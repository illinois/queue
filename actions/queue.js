import axios from 'axios'
import * as types from '../constants/ActionTypes'
import { makeActionCreator } from './util'

/**
 * Creating a new queue
 */
const createQueueRequest = makeActionCreator(types.CREATE_QUEUE_REQUEST, 'courseId', 'queue')
const createQueueSuccess = makeActionCreator(types.CREATE_QUEUE_SUCCESS, 'courseId', 'queue')
const createQueueFailure = makeActionCreator(types.CREATE_QUEUE_FAILURE, 'courseId', 'data')

export function createQueue(courseId, queue) {
  return (dispatch) => {
    dispatch(createQueueRequest(courseId, queue))

    return axios.post(`/api/courses/${courseId}/queues`, queue)
      .then(res => dispatch(createQueueSuccess(courseId, res.data)))
      .catch((err) => {
        console.error(err)
        dispatch(createQueueFailure(courseId))
      })
  }
}


/**
 * Fetch a queue
 */

const fetchQueueRequest = makeActionCreator(types.FETCH_QUEUE_REQUEST, 'queueId')
const fetchQueueSuccess = makeActionCreator(types.FETCH_QUEUE_SUCCESS, 'queueId', 'queue')
const fetchQueueFailure = makeActionCreator(types.FETCH_QUEUE_FAILURE, 'queueId', 'data')

export function fetchQueue(queueId) {
  return (dispatch) => {
    dispatch(fetchQueueRequest(queueId))

    return axios.get(`/api/queues/${queueId}`)
      .then(res => dispatch(fetchQueueSuccess(queueId, res.data)))
      .catch((err) => {
        console.error(err)
        dispatch(fetchQueueFailure(queueId, err))
      })
  }
}

/**
 * Delete a queue
 */
const deleteQueueRequest = makeActionCreator(types.DELETE_QUEUE_REQUEST, 'courseId', 'queueId')
const deleteQueueSuccess = makeActionCreator(types.DELETE_QUEUE_SUCCESS, 'courseId', 'queueId')
const deleteQueueFailure = makeActionCreator(types.DELETE_QUEUE_FAILURE, 'courseId', 'queueId')

export function deleteQueue(courseId, queueId) {
  return (dispatch) => {
    dispatch(deleteQueueRequest(courseId, queueId))

    return axios.delete(`/api/queues/${queueId}`)
      .then(
        () => dispatch(deleteQueueSuccess(courseId, queueId)),
        (err) => {
          console.error(err)
          dispatch(deleteQueueFailure(courseId, queueId))
        },
      )
  }
}

/**
 * Update all queues for a course
 */
export const updateQueues = makeActionCreator(types.UPDATE_QUEUES, 'courseId', 'queues')
