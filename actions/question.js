import axios from './axios'
import * as types from '../constants/ActionTypes'
import { makeActionCreator } from './util'

/**
 * Getting all questions for a certain queue
 */
const requestQuestionsRequest = makeActionCreator(types.FETCH_QUESTIONS.REQUEST, 'queueId')
const requestQuestionsSuccess = makeActionCreator(types.FETCH_QUESTIONS.SUCCESS, 'queueId', 'questions')
const requestQuestionsFailure = makeActionCreator(types.FETCH_QUESTIONS.FAILURE, 'queueId')

export function fetchQuestions(queueId) {
  return (dispatch) => {
    dispatch(requestQuestionsRequest(queueId))

    return axios.get(`/api/queues/${queueId}/questions`)
      .then(res => dispatch(requestQuestionsSuccess(queueId, res.data)))
      .catch((err) => {
        console.error(err)
        dispatch(requestQuestionsFailure(queueId))
      })
  }
}

/**
 * Creating a new question
 */
const createQuestionRequest = makeActionCreator(types.CREATE_QUESTION.REQUEST, 'queueId', 'question')
export const createQuestionSuccess = makeActionCreator(types.CREATE_QUESTION.SUCCESS, 'queueId', 'question')
const createQuestionFailure = makeActionCreator(types.CREATE_QUESTION.FAILURE, 'queueId', 'question')

export function createQuestion(queueId, question) {
  return (dispatch) => {
    dispatch(createQuestionRequest(queueId, question))

    return axios.post(`/api/queues/${queueId}/questions`, question)
      .then(res => dispatch(createQuestionSuccess(queueId, res.data)))
      .catch((err) => {
        console.error(err)
        dispatch(createQuestionFailure(queueId, question))
      })
  }
}

/**
 * Update if a question is being answered.
 */
const updateQuestionAnsweringRequest = makeActionCreator(types.UPDATE_QUESTION_ANSWERING.REQUEST, 'questionId', 'beingAnswered')
const updateQuestionAnsweringSuccess = makeActionCreator(types.UPDATE_QUESTION_ANSWERING.SUCCESS, 'questionId', 'beingAnswered')
const updateQuestionAnsweringFailure = makeActionCreator(types.UPDATE_QUESTION_ANSWERING.FAILURE, 'questionId', 'beingAnswered')

export function updateQuestionAnswering(questionId, beingAnswered) {
  return (dispatch) => {
    dispatch(updateQuestionAnsweringRequest(questionId, beingAnswered))

    const action = beingAnswered ? 'post' : 'delete'

    return axios[action](`/api/questions/${questionId}/answering`).then(
      () => dispatch(updateQuestionAnsweringSuccess(questionId, beingAnswered)),
      (err) => {
        console.error(err)
        dispatch(updateQuestionAnsweringFailure(questionId, beingAnswered))
      },
    )
  }
}

/**
 * Finishes answering a question and submits feedback for it
 */
const finishAnsweringQuestionRequest = makeActionCreator(types.FINISH_ANSWERING_QUESTION.REQUEST, 'queueId', 'questionId', 'feedback')
const finishAnsweringQuestionSuccess = makeActionCreator(types.FINISH_ANSWERING_QUESTION.SUCCESS, 'queueId', 'questionId', 'feedback')
const finishAnsweringQuestionFailure = makeActionCreator(types.FINISH_ANSWERING_QUESTION.FAILURE, 'queueId', 'questionId', 'feedback')

export function finishAnsweringQuestion(queueId, questionId, feedback) {
  return (dispatch) => {
    dispatch(finishAnsweringQuestionRequest(queueId, questionId, feedback))

    return axios.post(`/api/questions/${questionId}/answered`, feedback)
      .then(
        () => dispatch(finishAnsweringQuestionSuccess(queueId, questionId, feedback)),
        (err) => {
          console.error(err)
          dispatch(finishAnsweringQuestionFailure(queueId, questionId))
        },
      )
  }
}

/**
 * Delete a question
 */
const deleteQuestionRequest = makeActionCreator(types.DELETE_QUESTION.REQUEST, 'queueId', 'questionId')
export const deleteQuestionSuccess = makeActionCreator(types.DELETE_QUESTION.SUCCESS, 'queueId', 'questionId')
const deleteQuestionFailure = makeActionCreator(types.DELETE_QUESTION.FAILURE, 'queueId', 'questionId')

export function deleteQuestion(queueId, questionId) {
  return (dispatch) => {
    dispatch(deleteQuestionRequest(queueId, questionId))

    return axios.delete(`/api/questions/${questionId}`)
      .then(
        () => dispatch(deleteQuestionSuccess(queueId, questionId)),
        (err) => {
          console.error(err)
          dispatch(deleteQuestionFailure(queueId, questionId))
        },
      )
  }
}

/**
 * Update all questions for a queue
 */
export const updateQuestion = makeActionCreator(types.UPDATE_QUESTION, 'question')
export const replaceQuestions = makeActionCreator(types.REPLACE_QUESTIONS, 'queueId', 'questions')
