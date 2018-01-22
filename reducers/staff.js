import {
  ADD_STAFF,
  REMOVE_STAFF,
} from '../constants/ActionTypes'

const defaultState = {
  staff: [],
}

const addStaff = (newStaff, state) => {
  if (Object.keys(state.staff).find(staff => staff.id === newStaff.id)) {
    return state
  }

  return Object.assign({}, state, {
    staff: [...state.staff, newStaff],
  })
}

const removeStaff = (id, state) => Object.assign({}, state, {
  staff: [...state.staff].filter(staff => staff.id !== id),
})

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
