import axios from './axios'
import * as types from '../constants/ActionTypes'
import { makeActionCreator } from './util'

const fetchCurrentUserRequest = makeActionCreator(
  types.FETCH_CURRENT_USER.REQUEST
)
const fetchCurrentUserSuccess = makeActionCreator(
  types.FETCH_CURRENT_USER.SUCCESS,
  'user'
)
const fetchCurrentUserFailure = makeActionCreator(
  types.FETCH_CURRENT_USER.FAILURE,
  'data'
)

export function fetchCurrentUser() {
  return dispatch => {
    dispatch(fetchCurrentUserRequest())

    return axios.get('/api/users/me').then(
      res => dispatch(fetchCurrentUserSuccess(res.data)),
      err => {
        console.error(err)
        dispatch(fetchCurrentUserFailure(err))
      }
    )
  }
}

const updateUserPreferredNameRequest = makeActionCreator(
  types.UPDATE_USER_PREFERRED_NAME.REQUEST
)
const updateUserPreferredNameSuccess = makeActionCreator(
  types.UPDATE_USER_PREFERRED_NAME.SUCCESS,
  'user'
)
const updateUserPreferredNameFailure = makeActionCreator(
  types.UPDATE_USER_PREFERRED_NAME.FAILURE,
  'data'
)

export function updateUserPreferredName(preferredName) {
  return dispatch => {
    dispatch(updateUserPreferredNameRequest())

    return axios.patch('/api/users/me', { preferredName }).then(
      res => dispatch(updateUserPreferredNameSuccess(res.data)),
      err => {
        console.error(err)
        dispatch(updateUserPreferredNameFailure(err))
      }
    )
  }
}
