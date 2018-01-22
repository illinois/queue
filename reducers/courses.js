import {
  FETCH_COURSES_REQUEST,
  FETCH_COURSES_SUCCESS,
  FETCH_COURSES_FAILURE,
  FETCH_COURSE_SUCCESS,
  CREATE_QUEUE_SUCCESS,
} from '../constants/ActionTypes'

const defaultState = {
  isFetching: true,
  error: false,
  courses: {},
}

function normalizeCourse(course) {
  const newCourse = Object.assign({}, course)
  if (course.queues) {
    newCourse.queues = course.queues.map(queue => queue.id)
  }
  return newCourse
}

function addQueueToCourse(state, courseId, queue) {
  if (!(courseId in state.courses) || state.courses[courseId].queues.indexOf(queue.id) !== -1) {
    return state
  }

  const newState = Object.assign({}, state)
  newState.courses[courseId].queues.push(queue.id)
  return newState
}

const courses = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_COURSES_REQUEST: {
      return Object.assign({}, state, {
        isFetching: true,
      })
    }
    case FETCH_COURSES_SUCCESS: {
      return Object.assign({}, state, {
        isFetching: false,
        courses: action.courses.reduce((obj, item) => {
          // eslint-disable-next-line no-param-reassign
          obj[item.id] = normalizeCourse(item)
          return obj
        }, {}),
      })
    }
    case FETCH_COURSES_FAILURE: {
      return Object.assign({}, state, {
        isFetching: false,
        courses: {},
        error: true,
      })
    }
    case FETCH_COURSE_SUCCESS: {
      const { course } = action
      return Object.assign({}, state, {
        courses: {
          ...state.courses,
          [course.id]: normalizeCourse(course),
        },
      })
    }
    case CREATE_QUEUE_SUCCESS: {
      return addQueueToCourse(state, action.courseId, action.queue)
    }
    default:
      return state
  }
}

export default courses
