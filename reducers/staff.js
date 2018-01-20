import {
  ADD_STAFF,
  REMOVE_STAFF,
} from '../constants/ActionTypes'

const defaultState = {
  staff: []
}

const addStaff = (staff, state) => {
  for (const member of state.staff) {
    if (staff.id == member.id) {
      // This member is already in the staff list
      return state
    }
  }

  return Object.assign({}, state, {
    staff: [...state.staff, staff]
  })
}

const removeStaff = (id, state) => {
  console.log('weeee')
  console.log(id)
  console.log(id.id)
  return Object.assign({}, state, {
    staff: [...state.staff].filter(staff => staff.id != id)
  })
}

const staff = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_STAFF:
      return addStaff(action.staff, state)
    case REMOVE_STAFF:
      return removeStaff(action.id, state)
    default:
      return state
  }
}

export default staff
