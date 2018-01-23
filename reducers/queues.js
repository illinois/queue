import {
  FETCH_COURSE_REQUEST,
  FETCH_COURSE_SUCCESS,
  FETCH_COURSE_FAILURE,
  CREATE_QUEUE_SUCCESS,
  FETCH_QUEUE_SUCCESS,
  CREATE_QUESTION_SUCCESS,
  DELETE_QUESTION_SUCCESS,
} from '../constants/ActionTypes'

const defaultState = {
  isFetching: true,
  queues: {},
}

function normalizeQueue(queue) {
  const newQueue = Object.assign({}, queue)
  if (queue.questions) {
    newQueue.questions = queue.questions.map(question => question.id)
  }
  return newQueue
}

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

  const newState = Object.assign({}, state)
  const queue = newState.queues[queueId]
  queue.questions = queue.questions.filter(id => id !== questionId)
  return newState
}

// We need to extract the queues from

const queues = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_COURSE_REQUEST: {
      return Object.assign({}, state, {
        isFetching: true,
      })
    }
    case FETCH_COURSE_SUCCESS: {
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
    case FETCH_COURSE_FAILURE: {
      return Object.assign({}, state, {
        isFetching: false,
        error: true,
      })
    }
    case CREATE_QUEUE_SUCCESS: {
      const { queue } = action
      return Object.assign({}, state, {
        queues: {
          ...state.queues,
          [queue.id]: normalizeQueue(queue),
        },
      })
    }
    case FETCH_QUEUE_SUCCESS: {
      const { queue } = action
      return Object.assign({}, state, {
        queues: {
          ...state.queues,
          [queue.id]: normalizeQueue(queue),
        },
      })
    }
    case CREATE_QUESTION_SUCCESS: {
      return addQuestionToQueue(state, action.queueId, action.question.id)
    }
    case DELETE_QUESTION_SUCCESS: {
      return removeQuestionFromQueue(state, action.queueId, action.questionId)
    }
    default:
      return state
  }
}

export default queues
