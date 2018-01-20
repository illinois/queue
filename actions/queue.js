import * as types from '../constants/ActionTypes'
import axios from 'axios'

/***********************
 * Creating a new queue
 ***********************/
function createQueueRequest(courseId, queue) {
  return {
    type: types.CREATE_QUEUE_REQUEST,
    courseId,
    queue
  }
}

function createQueueSuccess(courseId, data) {
  return {
    type: types.CREATE_QUEUE_SUCCESS,
    courseId,
    data
  }
}

function createQueueFailure(courseId, data) {
  return {
    type: types.CREATE_QUEUE_FAILURE,
    data
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
