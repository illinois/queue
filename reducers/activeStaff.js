import {
  FETCH_QUEUE,
  ADD_QUEUE_STAFF,
  REMOVE_QUEUE_STAFF,
  REPLACE_ACTIVE_STAFF,
} from '../constants/ActionTypes'
import { normalizeQueue, normalizeActiveStaffList } from './normalize'

const defaultState = {
  activeStaff: {},
}

const activeStaff = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_QUEUE.SUCCESS: {
      const queue = normalizeQueue(action.queue)
      return {
        ...state,
        activeStaff: {
          ...state.activeStaff,
          ...queue.entities.activeStaff,
        },
      }
    }
    case ADD_QUEUE_STAFF.SUCCESS: {
      const { activeStaff: staff } = action
      return {
        ...state,
        activeStaff: {
          ...state.activeStaff,
          [staff.id]: staff,
        },
      }
    }
    case REMOVE_QUEUE_STAFF.SUCCESS: {
      const newState = { ...state }
      delete newState.activeStaff[action.activeStaffId]
      return newState
    }
    case REPLACE_ACTIVE_STAFF: {
      const normalized = normalizeActiveStaffList(action.activeStaff)
      return {
        ...state,
        activeStaff: {
          ...state.activeStaff,
          ...normalized.entities.activeStaff,
        },
      }
    }
    default:
      return state
  }
}

export default activeStaff
