import {
  FETCH_CURRENT_USER,
} from '../constants/ActionTypes'

const defaultState = {
  user: null,
}

const user = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_CURRENT_USER.SUCCESS:
      return {
        ...state,
        user: action.user,
      }
    default:
      return state
  }
}

export default user
