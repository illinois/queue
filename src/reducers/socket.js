import {
  SET_SOCKET_STATUS,
  SET_SOCKET_ERROR,
  RESET_SOCKET_STATE,
} from '../constants/ActionTypes'

const defaultState = {
  status: null,
  error: null,
}

const socket = (state = defaultState, action) => {
  switch (action.type) {
    case SET_SOCKET_STATUS:
      return {
        ...state,
        status: action.status,
      }
    case SET_SOCKET_ERROR:
      return {
        ...state,
        error: action.error,
      }
    case RESET_SOCKET_STATE:
      return {
        ...defaultState,
      }
    default:
      return state
  }
}

export default socket
