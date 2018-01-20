import {
  FETCH_COURSE_REQUEST,
  FETCH_COURSE_SUCCESS,
  FETCH_COURSE_FAILURE
} from '../constants/ActionTypes'

const defaultState = {
  courses: []
  coursesById
}

// We need to extract the queues from 

const queues = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_COURSES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case FETCH_COURSES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        courses: action.courses
      })
      return removeStaff(action.id, state)
    case FETCH_COURSES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        courses: [],
        error: true
      })

    default:
      return state
  }
}

export default queues
