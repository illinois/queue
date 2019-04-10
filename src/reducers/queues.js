import {
  FETCH_COURSE,
  FETCH_QUEUES,
  FETCH_QUEUE,
  CREATE_QUEUE,
  CREATE_QUESTION,
  DELETE_QUESTION,
  DELETE_ALL_QUESTIONS,
  UPDATE_QUEUE,
  DELETE_QUEUE,
  REPLACE_QUESTIONS,
  UPDATE_QUEUES,
  FINISH_ANSWERING_QUESTION,
  ADD_QUEUE_STAFF,
  REMOVE_QUEUE_STAFF,
  REPLACE_ACTIVE_STAFF,
} from '../constants/ActionTypes'

import {
  normalizeQueue as normalizeQueueHelper,
  normalizeActiveStaffList,
} from './normalize'

const defaultState = {
  isFetching: false,
  queues: {},
}

function normalizeQueue(queue) {
  const normalized = normalizeQueueHelper(queue)
  return normalized.entities.queues[normalized.result]
}

const reduceQueues = queues =>
  queues.reduce((obj, item) => {
    // eslint-disable-next-line no-param-reassign
    obj[item.id] = normalizeQueue(item)
    return obj
  }, {})

function addQuestionToQueue(state, queueId, questionId) {
  if (
    !(queueId in state.queues) ||
    state.queues[queueId].questions.indexOf(questionId) !== -1
  ) {
    return state
  }

  const newState = { ...state }
  newState.queues[queueId].questions.push(questionId)
  return newState
}

function removeQuestionFromQueue(state, queueId, questionId) {
  if (
    !(queueId in state.queues) ||
    state.queues[queueId].questions.indexOf(questionId) === -1
  ) {
    return state
  }

  const queue = state.queues[queueId]
  return {
    ...state,
    queues: {
      ...state.queues,
      [queueId]: {
        ...queue,
        questions: queue.questions.filter(id => id !== questionId),
      },
    },
  }
}

function removeAllQuestionsFromQueue(state, queueId) {
  const queue = state.queues[queueId]

  return {
    ...state,
    queues: {
      ...state.queues,
      [queueId]: {
        ...queue,
        questions: [],
      },
    },
  }
}

function addActiveStaffToQueue(state, queueId, activeStaffId) {
  if (
    !(queueId in state.queues) ||
    state.queues[queueId].activeStaff.indexOf(activeStaffId) !== -1
  ) {
    return state
  }

  const newState = { ...state }
  newState.queues[queueId].activeStaff.push(activeStaffId)
  return newState
}

const queues = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_COURSE.REQUEST: {
      return {
        ...state,
        isFetching: true,
      }
    }
    case FETCH_COURSE.SUCCESS: {
      return {
        ...state,
        isFetching: false,
        queues: {
          ...state.queues,
          ...action.course.queues.reduce((obj, item) => {
            const newQueue = normalizeQueue(item)
            // We'll merge in any new info about this queue but keep existing
            // info, since the queue models returned in course requests aren't
            // complete
            // eslint-disable-next-line no-param-reassign
            obj[item.id] = { ...state.queues[item.id], ...newQueue }
            return obj
          }, {}),
        },
      }
    }
    case FETCH_COURSE.FAILURE: {
      return {
        ...state,
        isFetching: false,
      }
    }
    case FETCH_QUEUES.SUCCESS: {
      return {
        ...state,
        isFetching: false,
        queues: {
          ...state.queues,
          ...action.queues.reduce((obj, item) => {
            // eslint-disable-next-line no-param-reassign
            obj[item.id] = normalizeQueue(item)
            return obj
          }, {}),
        },
      }
    }
    case FETCH_QUEUES.FAILURE: {
      return {
        ...state,
        isFetching: false,
      }
    }
    case CREATE_QUEUE.SUCCESS: {
      const { queue } = action
      return {
        ...state,
        queues: {
          ...state.queues,
          [queue.id]: normalizeQueue(queue),
        },
      }
    }
    case FETCH_QUEUE.REQUEST: {
      return {
        ...state,
        isFetching: true,
      }
    }
    case FETCH_QUEUE.SUCCESS: {
      const { queue } = action
      return {
        ...state,
        isFetching: false,
        queues: {
          ...state.queues,
          [queue.id]: normalizeQueue(queue),
        },
      }
    }
    case FETCH_QUEUE.FAILURE: {
      return {
        ...state,
        isFetching: false,
      }
    }
    case CREATE_QUESTION.SUCCESS: {
      return addQuestionToQueue(state, action.queueId, action.question.id)
    }
    case DELETE_QUESTION.SUCCESS: {
      return removeQuestionFromQueue(state, action.queueId, action.questionId)
    }
    case DELETE_ALL_QUESTIONS.SUCCESS: {
      return removeAllQuestionsFromQueue(state, action.queueId)
    }
    case UPDATE_QUEUE.SUCCESS: {
      const { queue } = action
      const originalQueue = state.queues[queue.id]
      return {
        ...state,
        queues: {
          ...state.queues,
          [queue.id]: {
            ...originalQueue,
            ...queue,
          },
        },
      }
    }
    case DELETE_QUEUE.SUCCESS: {
      const { queueId } = action
      const newQueues = { ...state.queues }
      delete newQueues[queueId]
      return {
        ...state,
        queues: newQueues,
      }
    }
    case REPLACE_QUESTIONS: {
      const { queueId, questions } = action
      const currentQueue = state.queues[queueId]
      return {
        ...state,
        queues: {
          ...state.queues,
          [action.queueId]: {
            ...currentQueue,
            questions: questions.map(q => q.id),
          },
        },
      }
    }
    case UPDATE_QUEUES: {
      return {
        ...state,
        queues: {
          ...state.queues,
          ...reduceQueues(action.queues),
        },
      }
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
            activeStaff: originalQueue.activeStaff.filter(
              id => id !== activeStaffId
            ),
          },
        },
      }
    }
    case REPLACE_ACTIVE_STAFF: {
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
