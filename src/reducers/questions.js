import {
  CREATE_QUESTION,
  FETCH_QUEUE,
  DELETE_QUESTION,
  DELETE_ALL_QUESTIONS,
  UPDATE_QUESTION,
  REPLACE_QUESTIONS,
  UPDATE_QUESTION_ANSWERING,
} from '../constants/ActionTypes'

const defaultState = {
  isFetching: false,
  error: null,
  questions: {},
}

const reduceQuestions = questions =>
  questions.reduce((obj, item) => {
    // eslint-disable-next-line no-param-reassign
    obj[item.id] = item
    return obj
  }, {})

const questions = (state = defaultState, action) => {
  switch (action.type) {
    case CREATE_QUESTION.SUCCESS: {
      const { question } = action
      return {
        ...state,
        error: null,
        questions: {
          ...state.questions,
          [question.id]: question,
        },
      }
    }
    case CREATE_QUESTION.FAILURE: {
      return {
        ...state,
        error: action.message,
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
        questions: {
          ...state.questions,
          ...reduceQuestions(queue.questions),
        },
      }
    }
    case DELETE_QUESTION.SUCCESS: {
      const { questionId } = action
      const newQuestions = { ...state.questions }
      delete newQuestions[questionId]
      return {
        ...state,
        questions: newQuestions,
      }
    }
    case DELETE_ALL_QUESTIONS.SUCCESS: {
      return {
        ...state,
        questions: {},
      }
    }
    case REPLACE_QUESTIONS: {
      return {
        ...state,
        questions: {
          ...state.questions,
          ...reduceQuestions(action.questions),
        },
      }
    }
    case UPDATE_QUESTION.SUCCESS: {
      const { question } = action
      return {
        ...state,
        questions: {
          ...state.questions,
          [question.id]: question,
        },
      }
    }
    case UPDATE_QUESTION_ANSWERING.SUCCESS: {
      const { questionId, beingAnswered } = action
      const oldQuestion = state.questions[questionId]
      return {
        ...state,
        questions: {
          ...state.questions,
          [questionId]: {
            ...oldQuestion,
            beingAnswered,
          },
        },
      }
    }
    default:
      return state
  }
}

export default questions
