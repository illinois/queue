import * as types from '../constants/ActionTypes'

export function addStaffMember(staff) {
  return {
    type: types.ADD_STAFF,
    staff,
  }
}

export function removeStaffMember(id) {
  return {
    type: types.REMOVE_STAFF,
    id,
  }
}
