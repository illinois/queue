import { combineReducers } from 'redux'
import staff from './staff'
import courses from './courses'
import questions from './questions'
import queues from './queues'

const Reducer = combineReducers({
  staff,
  courses,
  questions,
  queues,
})

export default Reducer
