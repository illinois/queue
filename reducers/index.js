import { combineReducers } from 'redux'
import staff from './staff'
import courses from './courses'

const Reducer = combineReducers({
  staff,
  courses
})

export default Reducer
