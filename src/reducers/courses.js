import {
  FETCH_COURSES,
  FETCH_COURSE,
  CREATE_COURSE,
  CREATE_QUEUE,
  DELETE_QUEUE,
  UPDATE_QUEUES,
  ADD_COURSE_STAFF,
  REMOVE_COURSE_STAFF,
} from '../constants/ActionTypes'

const defaultState = {
  isFetching: false,
  error: false,
  courses: {},
}

function normalizeCourse(course) {
  const newCourse = { ...course }
  if (course.queues) {
    newCourse.queues = course.queues.map(queue => queue.id)
  }
  if (course.staff) {
    newCourse.staff = course.staff.map(user => user.id)
  }
  return newCourse
}

function addStaffToCourse(state, courseId, userId) {
  if (
    !state.courses[courseId] ||
    state.courses[courseId].staff.indexOf(userId) !== -1
  ) {
    return state
  }

  const newState = { ...state }
  newState.courses[courseId].staff.push(userId)
  return newState
}

function removeStaffFromCourse(state, courseId, userId) {
  if (
    !state.courses[courseId] ||
    state.courses[courseId].staff.indexOf(userId) === -1
  ) {
    return state
  }

  const course = state.courses[courseId]
  return {
    ...state,
    courses: {
      ...state.courses,
      [courseId]: {
        ...course,
        staff: course.staff.filter(id => id !== userId),
      },
    },
  }
}

function addQueueToCourse(state, courseId, queue) {
  if (
    !state.courses[courseId] ||
    !state.courses[courseId].queues ||
    state.courses[courseId].queues.indexOf(queue.id) !== -1
  ) {
    return state
  }

  const newState = { ...state }
  if (!newState.courses[courseId].queues) {
    newState.courses[courseId].queues = []
  }
  newState.courses[courseId].queues.push(queue.id)
  return newState
}

function removeQueueFromCourse(state, courseId, queueId) {
  if (
    !state.courses[courseId] ||
    !state.courses[courseId].queues ||
    state.courses[courseId].queues.indexOf(queueId) === -1
  ) {
    return state
  }

  const course = state.courses[courseId]
  return {
    ...state,
    courses: {
      ...state.courses,
      [courseId]: {
        ...course,
        queues: course.queues.filter(id => id !== queueId),
      },
    },
  }
}

const courses = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_COURSES.REQUEST: {
      return {
        ...state,
        isFetching: true,
      }
    }
    case FETCH_COURSES.SUCCESS: {
      return {
        ...state,
        isFetching: false,
        courses: action.courses.reduce((obj, item) => {
          // eslint-disable-next-line no-param-reassign
          obj[item.id] = normalizeCourse(item)
          return obj
        }, {}),
      }
    }
    case FETCH_COURSES.FAILURE: {
      return {
        ...state,
        isFetching: false,
        courses: {},
      }
    }
    case FETCH_COURSE.REQUEST: {
      return {
        ...state,
        isFetching: true,
      }
    }
    case FETCH_COURSE.SUCCESS: {
      const { course } = action
      return {
        ...state,
        isFetching: false,
        courses: {
          ...state.courses,
          [course.id]: normalizeCourse(course),
        },
      }
    }
    case FETCH_COURSE.FAILURE: {
      return {
        ...state,
        isFetching: false,
      }
    }
    case CREATE_COURSE.SUCCESS: {
      const { course } = action
      return {
        ...state,
        courses: {
          ...state.courses,
          [course.id]: normalizeCourse(course),
        },
      }
    }
    case CREATE_QUEUE.SUCCESS: {
      return addQueueToCourse(state, action.courseId, action.queue)
    }
    case DELETE_QUEUE.SUCCESS:
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
    case ADD_COURSE_STAFF.SUCCESS:
      return addStaffToCourse(state, action.courseId, action.user.id)
    case REMOVE_COURSE_STAFF.SUCCESS:
      return removeStaffFromCourse(state, action.courseId, action.userId)
    default:
      return state
  }
}

export default courses
