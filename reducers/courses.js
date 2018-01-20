import {
  FETCH_COURSES_REQUEST,
  FETCH_COURSES_SUCCESS,
  FETCH_COURSES_FAILURE,
  FETCH_COURSE_REQUEST,
  FETCH_COURSE_SUCCESS,
  FETCH_COURSE_FAILURE
} from '../constants/ActionTypes'

const defaultState = {
  isFetching: true,
  error: false,
  courses: {}
}

const updateCourse = (state, course) => {
  const newState = Object.assign({}, state)
  newState.courses[course.id] = course
  return newState
}

const queues = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_COURSES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case FETCH_COURSES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        courses: action.courses.reduce((obj, item) => {
          obj[item.id] = item
          return obj
        }, {})
      })
      return removeStaff(action.id, state)
    case FETCH_COURSES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        courses: {},
        error: true
      })
    case FETCH_COURSE_SUCCESS:
      return updateCourse(state, action.course)
    default:
      return state
  }
}

export default queues
