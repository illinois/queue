import axios from './axios'
import * as types from '../constants/ActionTypes'
import { makeActionCreator } from './util'

/**
 * Getting all questions for a certain queue
 */
const requestQuestionsRequest = makeActionCreator(
  types.FETCH_QUESTIONS.REQUEST,
  'queueId'
)
const requestQuestionsSuccess = makeActionCreator(
  types.FETCH_QUESTIONS.SUCCESS,
  'queueId',
  'questions'
)
const requestQuestionsFailure = makeActionCreator(
  types.FETCH_QUESTIONS.FAILURE,
  'queueId'
)

export function fetchQuestions(queueId) {
  return dispatch => {
    dispatch(requestQuestionsRequest(queueId))

    return axios
      .get(`/api/queues/${queueId}/questions`)
      .then(res => dispatch(requestQuestionsSuccess(queueId, res.data)))
      .catch(err => {
        console.error(err)
        dispatch(requestQuestionsFailure(queueId))
      })
  }
}

/**
 * Creating a new question
 */
const createQuestionRequest = makeActionCreator(
  types.CREATE_QUESTION.REQUEST,
  'queueId',
  'question'
)
export const createQuestionSuccess = makeActionCreator(
  types.CREATE_QUESTION.SUCCESS,
  'queueId',
  'question'
)
const createQuestionFailure = makeActionCreator(
  types.CREATE_QUESTION.FAILURE,
  'queueId',
  'question',
  'message'
)

export function createQuestion(queueId, question) {
  return dispatch => {
    dispatch(createQuestionRequest(queueId, question))

    return axios
      .post(`/api/queues/${queueId}/questions`, question, {
        showErrorToast: false,
      })
      .then(res => dispatch(createQuestionSuccess(queueId, res.data)))
      .catch(err => {
        console.error(err)
        const { message } = err.response.data
        return dispatch(createQuestionFailure(queueId, question, message))
      })
  }
}

/**
 * Update if a question is being answered.
 */
const updateQuestionAnsweringRequest = makeActionCreator(
  types.UPDATE_QUESTION_ANSWERING.REQUEST,
  'questionId',
  'beingAnswered'
)
const updateQuestionAnsweringSuccess = makeActionCreator(
  types.UPDATE_QUESTION_ANSWERING.SUCCESS,
  'questionId',
  'beingAnswered'
)
const updateQuestionAnsweringFailure = makeActionCreator(
  types.UPDATE_QUESTION_ANSWERING.FAILURE,
  'questionId',
  'beingAnswered'
)

export function updateQuestionAnswering(questionId, beingAnswered) {
  return dispatch => {
    dispatch(updateQuestionAnsweringRequest(questionId, beingAnswered))

    const action = beingAnswered ? 'post' : 'delete'

    return axios[action](`/api/questions/${questionId}/answering`).then(
      () => dispatch(updateQuestionAnsweringSuccess(questionId, beingAnswered)),
      err => {
        console.error(err)
        dispatch(updateQuestionAnsweringFailure(questionId, beingAnswered))
      }
    )
  }
}

/**
 * Update a question's attributes
 */
const updateQuestionRequest = makeActionCreator(
  types.UPDATE_QUESTION.REQUEST,
  'questionId',
  'attributes'
)
export const updateQuestionSuccess = makeActionCreator(
  types.UPDATE_QUESTION.SUCCESS,
  'questionId',
  'question'
)
const updateQuestionFailure = makeActionCreator(
  types.UPDATE_QUESTION.FAILURE,
  'questionId'
)

export function updateQuestion(questionId, attributes) {
  return dispatch => {
    dispatch(updateQuestionRequest(questionId, attributes))
    return axios.patch(`/api/questions/${questionId}`, attributes).then(
      res => dispatch(updateQuestionSuccess(questionId, res.data)),
      err => {
        console.error(err)
        dispatch(updateQuestionFailure(questionId))
      }
    )
  }
}

/**
 * Finishes answering a question and submits feedback for it
 */
const finishAnsweringQuestionRequest = makeActionCreator(
  types.FINISH_ANSWERING_QUESTION.REQUEST,
  'queueId',
  'questionId',
  'feedback'
)
const finishAnsweringQuestionSuccess = makeActionCreator(
  types.FINISH_ANSWERING_QUESTION.SUCCESS,
  'queueId',
  'questionId',
  'feedback'
)
const finishAnsweringQuestionFailure = makeActionCreator(
  types.FINISH_ANSWERING_QUESTION.FAILURE,
  'queueId',
  'questionId',
  'feedback'
)

export function finishAnsweringQuestion(queueId, questionId, feedback) {
  return dispatch => {
    dispatch(finishAnsweringQuestionRequest(queueId, questionId, feedback))

    return axios.post(`/api/questions/${questionId}/answered`, feedback).then(
      () =>
        dispatch(finishAnsweringQuestionSuccess(queueId, questionId, feedback)),
      err => {
        console.error(err)
        dispatch(finishAnsweringQuestionFailure(queueId, questionId))
      }
    )
  }
}

/**
 * Delete a question
 */
const deleteQuestionRequest = makeActionCreator(
  types.DELETE_QUESTION.REQUEST,
  'queueId',
  'questionId'
)
export const deleteQuestionSuccess = makeActionCreator(
  types.DELETE_QUESTION.SUCCESS,
  'queueId',
  'questionId'
)
const deleteQuestionFailure = makeActionCreator(
  types.DELETE_QUESTION.FAILURE,
  'queueId',
  'questionId'
)

export function deleteQuestion(queueId, questionId) {
  return dispatch => {
    dispatch(deleteQuestionRequest(queueId, questionId))

    return axios.delete(`/api/questions/${questionId}`).then(
      () => dispatch(deleteQuestionSuccess(queueId, questionId)),
      err => {
        console.error(err)
        dispatch(deleteQuestionFailure(queueId, questionId))
      }
    )
  }
}

/**
 * Delete all Questions
 */
const deleteAllQuestionsRequest = makeActionCreator(
  types.DELETE_ALL_QUESTIONS.REQUEST,
  'queueId'
)

export const deleteAllQuestionsSuccess = makeActionCreator(
  types.DELETE_ALL_QUESTIONS.SUCCESS,
  'queueId'
)

const deleteAllQuestionsFailure = makeActionCreator(
  types.DELETE_ALL_QUESTIONS.FAILURE,
  'queueId'
)

export function deleteAllQuestions(queueId) {
  return dispatch => {
    dispatch(deleteAllQuestionsRequest(queueId))

    return axios.delete(`/api/queues/${queueId}/questions`).then(
      () => dispatch(deleteAllQuestionsSuccess(queueId)),
      err => {
        console.error(err)
        dispatch(deleteAllQuestionsFailure(queueId))
      }
    )
  }
}

/**
 * Update all questions for a queue
 */
export const replaceQuestions = makeActionCreator(
  types.REPLACE_QUESTIONS,
  'queueId',
  'questions'
)
