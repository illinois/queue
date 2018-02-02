import {
  CREATE_QUESTION,
  FETCH_QUEUE,
  DELETE_QUESTION,
  UPDATE_QUESTIONS,
  UPDATE_QUESTION_ANSWERING,
} from '../constants/ActionTypes'

const defaultState = {
  isFetching: false,
  error: false,
  questions: {},
}

const reduceQuestions = questions => questions.reduce((obj, item) => {
  // eslint-disable-next-line no-param-reassign
  obj[item.id] = item
  return obj
}, {})

const questions = (state = defaultState, action) => {
  switch (action.type) {
    case CREATE_QUESTION.SUCCESS: {
      const { question } = action
      return Object.assign({}, state, {
        questions: {
          ...state.questions,
          [question.id]: question,
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
        questions: {
          ...state.questions,
          ...reduceQuestions(queue.questions),
        },
      })
    }
    case DELETE_QUESTION.SUCCESS: {
      const { questionId } = action
      return Object.assign({}, state, {
        questions: {
          ...state.questions,
          [questionId]: undefined,
        },
      })
    }
    case UPDATE_QUESTIONS: {
      return Object.assign({}, state, {
        questions: {
          ...state.questions,
          ...reduceQuestions(action.questions),
        },
      })
    }
    case UPDATE_QUESTION_ANSWERING.SUCCESS: {
      const { questionId, beingAnswered } = action
      const oldQuestion = state.questions[questionId]
      return Object.assign({}, state, {
        questions: {
          ...state.questions,
          [questionId]: {
            ...oldQuestion,
            beingAnswered,
          },
        },
      })
    }
    default:
      return state
  }
}

export default questions
