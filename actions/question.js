import axios from 'axios'
import * as types from '../constants/ActionTypes'
import { makeActionCreator } from './util'

/**
 * Getting all questions for a certain queue
 */
const requestQuestionsRequest = makeActionCreator(types.FETCH_QUESTIONS_REQUEST, 'queueId')
const requestQuestionsSuccess = makeActionCreator(types.FETCH_QUESTIONS_SUCCESS, 'queueId', 'questions')
const requestQuestionsFailure = makeActionCreator(types.FETCH_QUESTIONS_FAILURE, 'queueId')

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
const createQuestionRequest = makeActionCreator(types.CREATE_QUESTION_REQUEST, 'queueId', 'question')
const createQuestionSuccess = makeActionCreator(types.CREATE_QUESTION_SUCCESS, 'queueId', 'question')
const createQuestionFailure = makeActionCreator(types.CREATE_QUESTION_FAILURE, 'queueId', 'question')

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
 * Delete a question
 */
const deleteQuestionRequest = makeActionCreator(types.DELETE_QUESTION_REQUEST, 'queueId', 'questionId')
const deleteQuestionSuccess = makeActionCreator(types.DELETE_QUESTION_SUCCESS, 'queueId', 'questionId')
const deleteQuestionFailure = makeActionCreator(types.DELETE_QUESTION_FAILURE, 'queueId', 'questionId')

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
export const updateQuestions = makeActionCreator(types.UPDATE_QUESTIONS, 'queueId', 'questions')
