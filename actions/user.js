import axios from 'axios'
import * as types from '../constants/ActionTypes'
import { makeActionCreator } from './util'

const fetchCurrentUserRequest = makeActionCreator(types.FETCH_CURRENT_USER.REQUEST)
const fetchCurrentUserSuccess = makeActionCreator(types.FETCH_CURRENT_USER.SUCCESS, 'user')
const fetchCurrentUserFailure = makeActionCreator(types.FETCH_CURRENT_USER.FAILURE, 'data')

export function fetchCurrentUser() {
  return (dispatch) => {
    dispatch(fetchCurrentUserRequest())

    return axios.get('/api/users/me')
      .then(
        res => dispatch(fetchCurrentUserSuccess(res.data)),
        (err) => {
          console.error(err)
          dispatch(fetchCurrentUserFailure(err))
        },
      )
  }
}

export const PLACEHOLDER = 'null'
