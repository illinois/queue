import { combineReducers } from 'redux'
import staff from './staff'
import courses from './courses'
import questions from './questions'
import queues from './queues'
import users from './users'

const Reducer = combineReducers({
  staff,
  courses,
  questions,
  queues,
  users,
})

export default Reducer
