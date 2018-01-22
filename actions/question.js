import axios from 'axios'
import * as types from '../constants/ActionTypes'

/**
 * Getting all questions for a certain queue
 */
function requestQuestions(queueId) {
  return {
    type: types.FETCH_QUESTIONS_REQUEST,
    queueId,
  }
}

function requestQuestionsSuccess(queueId, questions) {
  return {
    type: types.FETCH_QUESTIONS_SUCCESS,
    queueId,
    questions,
  }
}

function requestQuestionsFailure(queueId) {
  return {
    type: types.FETCH_QUESTIONS_FAILURE,
    queueId,
  }
}

export function fetchQuestions(queueId) {
  return (dispatch) => {
    dispatch(requestQuestions(queueId))

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
function createQuestionRequest(queueId, question) {
  return {
    type: types.CREATE_QUESTION_REQUEST,
    queueId,
    question,
  }
}

function createQuestionSuccess(queueId, question) {
  return {
    type: types.CREATE_QUESTION_SUCCESS,
    queueId,
    question,
  }
}

function createQuestionFailure(queueId, question) {
  return {
    type: types.CREATE_QUESTION_FAILURE,
    queueId,
    question,
  }
}

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
