import { combineReducers } from 'redux'
import staff from './staff'
import courses from './courses'
import queues from './queues'

const Reducer = combineReducers({
  staff,
  courses,
  queues
})

export default Reducer
