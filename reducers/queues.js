import {
  FETCH_COURSE_REQUEST,
  FETCH_COURSE_SUCCESS,
  FETCH_COURSE_FAILURE,
  CREATE_QUEUE_REQUEST,
  CREATE_QUEUE_SUCCESS,
  CREATE_QUEUE_FAILURE
} from '../constants/ActionTypes'

const defaultState = {
  isFetching: true,
  queues: {}
}

// We need to extract the queues from

const queues = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_COURSE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case FETCH_COURSE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        queues: {
          ...state.queues,
          ...action.course.queues.reduce((obj, item) => {
            obj[item.id] = item
            return obj
          }, {})
        }
      })
      return removeStaff(action.id, state)
    case FETCH_COURSE_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: true
      })
    case CREATE_QUEUE_SUCCESS:
      const queue = action.data.queue
      return Object.assign({}, state, {
        queues: {
          ...state.queues,
          [queue.id]: queue
        }
      })

    default:
      return state
  }
}

export default queues
