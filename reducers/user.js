import {
  FETCH_CURRENT_USER,
  UPDATE_USER_PREFERRED_NAME,
} from '../constants/ActionTypes'

const defaultState = {
  user: null,
}

function normalizeUser(user) {
  return {
    ...user,
    staffAssignments: user.staffAssignments.map(course => course.id),
  }
}

const user = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_CURRENT_USER.SUCCESS:
    case UPDATE_USER_PREFERRED_NAME.SUCCESS:
      return {
        ...state,
        user: normalizeUser(action.user),
      }
    default:
      return state
  }
}

export default user
