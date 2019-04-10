import { SET_SOCKET_STATUS, RESET_SOCKET_STATE } from '../constants/ActionTypes'

const defaultState = {
  status: null,
}

const socket = (state = defaultState, action) => {
  switch (action.type) {
    case SET_SOCKET_STATUS:
      return {
        ...state,
        status: action.status,
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
