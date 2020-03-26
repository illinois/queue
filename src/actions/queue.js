import axios from './axios'
import * as types from '../constants/ActionTypes'
import { makeActionCreator } from './util'
import { normalizeActiveStaff } from '../reducers/normalize'

/**
 * Loading all courses
 */
export const fetchQueuesRequest = makeActionCreator(types.FETCH_QUEUES.REQUEST)
const fetchQueuesSuccess = makeActionCreator(
  types.FETCH_QUEUES.SUCCESS,
  'queues'
)
const fetchQueuesFailure = makeActionCreator(types.FETCH_QUEUES.FAILURE, 'data')

export function fetchQueues() {
  return dispatch => {
    dispatch(fetchQueuesRequest())

    return axios.get('/api/queues').then(
      res => dispatch(fetchQueuesSuccess(res.data)),
      err => {
        console.error(err)
        dispatch(fetchQueuesFailure(err))
      }
    )
  }
}

/**
 * Creating a new queue
 */
const createQueueRequest = makeActionCreator(
  types.CREATE_QUEUE.REQUEST,
  'courseId',
  'queue'
)
const createQueueSuccess = makeActionCreator(
  types.CREATE_QUEUE.SUCCESS,
  'courseId',
  'queue'
)
const createQueueFailure = makeActionCreator(
  types.CREATE_QUEUE.FAILURE,
  'courseId',
  'data'
)

export function createQueue(courseId, queue) {
  return dispatch => {
    dispatch(createQueueRequest(courseId, queue))

    return axios
      .post(`/api/courses/${courseId}/queues`, queue)
      .then(res => dispatch(createQueueSuccess(courseId, res.data)))
      .catch(err => {
        console.error(err)
        dispatch(createQueueFailure(courseId))
      })
  }
}

/**
 * Fetch a queue
 */
export const fetchQueueRequest = makeActionCreator(
  types.FETCH_QUEUE.REQUEST,
  'queueId'
)
const fetchQueueSuccess = makeActionCreator(
  types.FETCH_QUEUE.SUCCESS,
  'queueId',
  'queue'
)
const fetchQueueFailure = makeActionCreator(
  types.FETCH_QUEUE.FAILURE,
  'queueId',
  'data'
)

export function fetchQueue(queueId) {
  return dispatch => {
    dispatch(fetchQueueRequest(queueId))

    return axios
      .get(`/api/queues/${queueId}`)
      .then(res => dispatch(fetchQueueSuccess(queueId, res.data)))
      .catch(err => {
        console.error(err)
        return dispatch(fetchQueueFailure(queueId, err))
      })
  }
}

/**
 * Update a queue's attributes
 */
const updateQueueRequest = makeActionCreator(
  types.UPDATE_QUEUE.REQUEST,
  'queueId',
  'attributes'
)
export const updateQueueSuccess = makeActionCreator(
  types.UPDATE_QUEUE.SUCCESS,
  'queueId',
  'queue'
)
const updateQueueFailure = makeActionCreator(
  types.UPDATE_QUEUE.FAILURE,
  'queueId'
)

export function updateQueue(queueId, attributes) {
  return dispatch => {
    dispatch(updateQueueRequest(queueId, attributes))
    return axios.patch(`/api/queues/${queueId}`, attributes).then(
      res => dispatch(updateQueueSuccess(queueId, res.data)),
      err => {
        console.error(err)
        dispatch(updateQueueFailure(queueId))
      }
    )
  }
}

/**
 * Delete a queue
 */
const deleteQueueRequest = makeActionCreator(
  types.DELETE_QUEUE.REQUEST,
  'courseId',
  'queueId'
)
const deleteQueueSuccess = makeActionCreator(
  types.DELETE_QUEUE.SUCCESS,
  'courseId',
  'queueId'
)
const deleteQueueFailure = makeActionCreator(
  types.DELETE_QUEUE.FAILURE,
  'courseId',
  'queueId'
)

export function deleteQueue(courseId, queueId) {
  return dispatch => {
    dispatch(deleteQueueRequest(courseId, queueId))

    return axios.delete(`/api/queues/${queueId}`).then(
      () => dispatch(deleteQueueSuccess(courseId, queueId)),
      err => {
        console.error(err)
        dispatch(deleteQueueFailure(courseId, queueId))
      }
    )
  }
}

/**
 * Adds a user to queue's active staff
 */
const addQueueStaffRequest = makeActionCreator(
  types.ADD_QUEUE_STAFF.REQUEST,
  'queueId',
  'userId'
)
export const addQueueStaffSuccess = makeActionCreator(
  types.ADD_QUEUE_STAFF.SUCCESS,
  'queueId',
  'userId',
  'activeStaff',
  'normalized'
)
const addQueueStaffFailure = makeActionCreator(
  types.ADD_QUEUE_STAFF.FAILURE,
  'queueId',
  'userId',
  'data'
)

export function addQueueStaff(queueId, userId) {
  return dispatch => {
    dispatch(addQueueStaffRequest(queueId, userId))

    return axios.post(`/api/queues/${queueId}/staff/${userId}`).then(
      res => {
        const normalized = normalizeActiveStaff(res.data)
        const activeStaff = normalized.entities.activeStaff[normalized.result]
        return dispatch(
          addQueueStaffSuccess(queueId, userId, activeStaff, normalized)
        )
      },
      err => {
        console.error(err)
        dispatch(addQueueStaffFailure(queueId, userId))
      }
    )
  }
}

/**
 * Removes a user from a queue's active staff
 */
const removeQueueStaffRequest = makeActionCreator(
  types.REMOVE_QUEUE_STAFF.REQUEST,
  'queueId',
  'userId',
  'activeStaffId'
)
export const removeQueueStaffSuccess = makeActionCreator(
  types.REMOVE_QUEUE_STAFF.SUCCESS,
  'queueId',
  'userId',
  'activeStaffId'
)
const removeQueueStaffFailure = makeActionCreator(
  types.REMOVE_QUEUE_STAFF.FAILURE,
  'queueId',
  'userId',
  'activeStaffId',
  'data'
)

export function removeQueueStaff(queueId, userId, activeStaffId) {
  return dispatch => {
    dispatch(removeQueueStaffRequest(queueId, userId, activeStaffId))

    return axios.delete(`/api/queues/${queueId}/staff/${userId}`).then(
      () => dispatch(removeQueueStaffSuccess(queueId, userId, activeStaffId)),
      err => {
        console.error(err)
        dispatch(removeQueueStaffFailure(queueId, userId, activeStaffId, err))
      }
    )
  }
}

/**
 * Update all queues for a course
 */
export const updateQueues = makeActionCreator(
  types.UPDATE_QUEUES,
  'courseId',
  'queues'
)
