import { makeActionCreator } from './util'
import * as types from '../constants/ActionTypes'

export const setSocketError = makeActionCreator(types.SET_SOCKET_ERROR, 'error')

export const setSocketStatus = makeActionCreator(
  types.SET_SOCKET_STATUS,
  'status'
)

export const resetSocketState = makeActionCreator(types.RESET_SOCKET_STATE)
