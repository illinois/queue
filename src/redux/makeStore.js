/* eslint-env browser */
/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import questionNotificationMiddleware from './questionNotificationMiddleware'

const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose
const makeStore = initialState =>
  createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk, questionNotificationMiddleware))
  )

export default makeStore
