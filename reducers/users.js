import {
  FETCH_COURSE,
  FETCH_QUEUE,
  ADD_COURSE_STAFF,
  ADD_QUEUE_STAFF,
  REPLACE_ACTIVE_STAFF,
} from '../constants/ActionTypes'
import { normalizeQueue, normalizeActiveStaffList } from './normalize'

const defaultState = {
  users: {},
  isFetching: false,
}

const reduceUsers = users =>
  users.reduce((obj, item) => {
    // eslint-disable-next-line no-param-reassign
    obj[item.id] = item
    return obj
  }, {})

const users = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_COURSE.REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case FETCH_COURSE.FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    case FETCH_COURSE.SUCCESS:
      // Course requests won't contain users for non-course staff
      if (action.course.staff) {
        return {
          ...state,
          isFetching: false,
          users: {
            ...state.users,
            ...reduceUsers(action.course.staff),
          },
        }
      }
      return {
        ...state,
        isFetching: false,
      }
    case ADD_COURSE_STAFF.SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          [action.user.id]: action.user,
        },
      }
    case FETCH_QUEUE.SUCCESS: {
      const queue = normalizeQueue(action.queue)
      return {
        ...state,
        users: {
          ...state.users,
          ...queue.entities.users,
        },
      }
    }
    case ADD_QUEUE_STAFF.SUCCESS: {
      const { activeStaff, normalized } = action
      const user = normalized.entities.users[activeStaff.user]
      return {
        ...state,
        users: {
          ...state.users,
          [activeStaff.user]: user,
        },
      }
    }
    case REPLACE_ACTIVE_STAFF: {
      const { activeStaff } = action
      const normalized = normalizeActiveStaffList(activeStaff)
      return {
        ...state,
        users: {
          ...state.users,
          ...normalized.entities.users,
        },
      }
    }
    default:
      return state
  }
}

export default users
