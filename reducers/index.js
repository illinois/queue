import { combineReducers } from 'redux'
import staff from './staff'
import courses from './courses'
import questions from './questions'
import queues from './queues'
import users from './users'
import user from './user'

const Reducer = combineReducers({
  staff,
  courses,
  questions,
  queues,
  users,
  user,
})

export default Reducer
