import {
  FETCH_CURRENT_USER,
  UPDATE_USER_PREFERRED_NAME,
  ADD_STARRED_BY_USER,
  REMOVE_STARRED_BY_USER,
} from '../constants/ActionTypes'

const defaultState = {
  user: null,
}

function normalizeUser(user) {
  return {
    ...user,
    staffAssignments: user.staffAssignments.map(course => course.id),
  }
}

function addStarToQueue(state, queue) {
  if (state.user.starredQueues.find(starredQueue => starredQueue.id === queue.id) !== undefined) {
    return state
  }

  const newState = { ...state }
  newState.user.starredQueues.push(queue)
  return newState
}

function removeStarFromQueue(state, queue) {
  if (state.user.starredQueues.find(starredQueue => starredQueue.id === queue.id) === undefined) {
    return state
  }

  const newState = { ...state } 
  newState.user.starredQueues = newState.user.starredQueues.filter(
    oldQueue => oldQueue.id !== queue.id
  )
  return newState;
}

const user = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_CURRENT_USER.SUCCESS:
    case UPDATE_USER_PREFERRED_NAME.SUCCESS:
      return {
        ...state,
        user: normalizeUser(action.user),
      }
    case ADD_STARRED_BY_USER.SUCCESS: {
      return addStarToQueue(state, action.queue)
    }
    case REMOVE_STARRED_BY_USER.SUCCESS: {
      return removeStarFromQueue(state, action.queue)
    }
    default:
      return state
  }
}

export default user
