/* eslint-env browser */
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers'

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
const makeStore = initialState => createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk)),
)

export default makeStore
