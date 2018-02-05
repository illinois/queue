import {
  FETCH_COURSE,
  FETCH_QUEUE,
  CREATE_QUEUE,
  CREATE_QUESTION,
  DELETE_QUESTION,
  DELETE_QUEUE,
  UPDATE_QUESTIONS,
  UPDATE_QUEUES,
  FINISH_ANSWERING_QUESTION,
  ADD_QUEUE_STAFF,
  REMOVE_QUEUE_STAFF,
  UPDATE_ACTIVE_STAFF,
} from '../constants/ActionTypes'

import { normalizeQueue as normalizeQueueHelper, normalizeActiveStaffList } from './normalize'

const defaultState = {
  isFetching: false,
  queues: {},
}

function normalizeQueue(queue) {
  const normalized = normalizeQueueHelper(queue)
  return normalized.entities.queues[normalized.result]
}

const reduceQueues = queues => queues.reduce((obj, item) => {
  // eslint-disable-next-line no-param-reassign
  obj[item.id] = normalizeQueue(item)
  return obj
}, {})

function addQuestionToQueue(state, queueId, questionId) {
  if (!(queueId in state.queues) || state.queues[queueId].questions.indexOf(questionId) !== -1) {
    return state
  }

  const newState = Object.assign({}, state)
  newState.queues[queueId].questions.push(questionId)
  return newState
}

function removeQuestionFromQueue(state, queueId, questionId) {
  if (!(queueId in state.queues) || state.queues[queueId].questions.indexOf(questionId) === -1) {
    return state
  }

  const queue = state.queues[queueId]
  const newState = Object.assign({}, state, {
    queues: {
      ...state.queues,
      [queueId]: {
        ...queue,
        questions: queue.questions.filter(id => id !== questionId),
      },
    },
  })
  return newState
}

function addActiveStaffToQueue(state, queueId, activeStaffId) {
  if (!(queueId in state.queues) || state.queues[queueId].activeStaff.indexOf(activeStaffId) !== -1) {
    return state
  }

  const newState = { ...state }
  newState.queues[queueId].activeStaff.push(activeStaffId)
  return newState
}

// We need to extract the queues from

const queues = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_COURSE.REQUEST: {
      return Object.assign({}, state, {
        isFetching: true,
      })
    }
    case FETCH_COURSE.SUCCESS: {
      return Object.assign({}, state, {
        isFetching: false,
        queues: {
          ...state.queues,
          ...action.course.queues.reduce((obj, item) => {
            // eslint-disable-next-line no-param-reassign
            obj[item.id] = normalizeQueue(item)
            return obj
          }, {}),
        },
      })
    }
    case FETCH_COURSE.FAILURE: {
      return Object.assign({}, state, {
        isFetching: false,
        error: true,
      })
    }
    case CREATE_QUEUE.SUCCESS: {
      const { queue } = action
      return Object.assign({}, state, {
        queues: {
          ...state.queues,
          [queue.id]: normalizeQueue(queue),
        },
      })
    }
    case FETCH_QUEUE.REQUEST: {
      return Object.assign({}, state, {
        isFetching: true,
      })
    }
    case FETCH_QUEUE.SUCCESS: {
      const { queue } = action
      return Object.assign({}, state, {
        isFetching: false,
        queues: {
          ...state.queues,
          [queue.id]: normalizeQueue(queue),
        },
      })
    }
    case CREATE_QUESTION.SUCCESS: {
      return addQuestionToQueue(state, action.queueId, action.question.id)
    }
    case DELETE_QUESTION.SUCCESS: {
      return removeQuestionFromQueue(state, action.queueId, action.questionId)
    }
    case DELETE_QUEUE.SUCCESS: {
      return Object.assign({}, state, {
        queues: {
          ...state.queues,
          [action.queueId]: undefined,
        },
      })
    }
    case UPDATE_QUESTIONS: {
      const { queueId, questions } = action
      const currentQueue = state.queues[queueId]
      return Object.assign({}, state, {
        queues: {
          ...state.queues,
          [action.queueId]: {
            ...currentQueue,
            questions: questions.map(q => q.id),
          },
        },
      })
    }
    case UPDATE_QUEUES: {
      return Object.assign({}, state, {
        queues: {
          ...state.queues,
          ...reduceQueues(action.queues),
        },
      })
    }
    case FINISH_ANSWERING_QUESTION.SUCCESS: {
      return removeQuestionFromQueue(state, action.queueId, action.questionId)
    }
    case ADD_QUEUE_STAFF.SUCCESS: {
      const { queueId, activeStaff } = action
      return addActiveStaffToQueue(state, queueId, activeStaff.id)
    }
    case REMOVE_QUEUE_STAFF.SUCCESS: {
      const { queueId, activeStaffId } = action
      const originalQueue = state.queues[queueId]
      return {
        ...state,
        queues: {
          ...state.queues,
          [queueId]: {
            ...originalQueue,
            activeStaff: originalQueue.activeStaff.filter(id => id !== activeStaffId),
          },
        },
      }
    }
    case UPDATE_ACTIVE_STAFF: {
      const { queueId, activeStaff } = action
      const normalized = normalizeActiveStaffList(activeStaff)
      const originalQueue = state.queues[queueId]
      return {
        ...state,
        queues: {
          ...state.queues,
          [queueId]: {
            ...originalQueue,
            activeStaff: normalized.result,
          },
        },
      }
    }
    default:
      return state
  }
}

export default queues
