import {
  FETCH_COURSES_REQUEST,
  FETCH_COURSES_SUCCESS,
  FETCH_COURSES_FAILURE,
  FETCH_COURSE_REQUEST,
  FETCH_COURSE_SUCCESS,
  CREATE_COURSE_SUCCESS,
  CREATE_QUEUE_SUCCESS,
  DELETE_QUEUE_SUCCESS,
  UPDATE_QUEUES,
} from '../constants/ActionTypes'

const defaultState = {
  isFetching: false,
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

function removeQueueFromCourse(state, courseId, queueId) {
  if (!(courseId in state.courses) || state.courses[courseId].queues.indexOf(queueId) === -1) {
    return state
  }

  const course = state.courses[courseId]
  const newState = Object.assign({}, state, {
    courses: {
      ...state.courses,
      [courseId]: {
        ...course,
        queues: course.queues.filter(id => id !== queueId),
      },
    },
  })
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
    case FETCH_COURSE_REQUEST: {
      return Object.assign({}, state, {
        isFetching: true,
      })
    }
    case FETCH_COURSE_SUCCESS: {
      const { course } = action
      return Object.assign({}, state, {
        isFetching: false,
        courses: {
          ...state.courses,
          [course.id]: normalizeCourse(course),
        },
      })
    }
    case CREATE_COURSE_SUCCESS: {
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
    case DELETE_QUEUE_SUCCESS:
      return removeQueueFromCourse(state, action.courseId, action.queueId)
    case UPDATE_QUEUES: {
      const { courseId, queues } = action
      const originalCourse = state.courses[courseId]
      return {
        ...state,
        courses: {
          ...state.courses,
          [courseId]: {
            ...originalCourse,
            queues: queues.map(queue => queue.id),
          },
        },
      }
    }
    default:
      return state
  }
}

export default courses
