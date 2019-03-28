function makeActionStrings(action) {
  return {
    REQUEST: `${action}_REQUEST`,
    SUCCESS: `${action}_SUCCESS`,
    FAILURE: `${action}_FAILURE`,
  }
}

export const FETCH_COURSES = makeActionStrings('FETCH_COURSES')
export const FETCH_COURSE = makeActionStrings('FETCH_COURSE')
export const CREATE_COURSE = makeActionStrings('CREATE_COURSE')
export const ADD_COURSE_STAFF = makeActionStrings('ADD_COURSE_STAFF')
export const REMOVE_COURSE_STAFF = makeActionStrings('REMOVE_COURSE_STAFF')

export const FETCH_QUEUES = makeActionStrings('FETCH_QUEUES')
export const FETCH_QUEUE = makeActionStrings('FETCH_QUEUE')
export const CREATE_QUEUE = makeActionStrings('CREATE_QUEUE')
export const UPDATE_QUEUE = makeActionStrings('UPDATE_QUEUE')
export const DELETE_QUEUE = makeActionStrings('DELETE_QUEUE')
export const ADD_QUEUE_STAFF = makeActionStrings('ADD_QUEUE_STAFF')
export const REMOVE_QUEUE_STAFF = makeActionStrings('REMOVE_QUEUE_STAFF')

export const FETCH_QUESTIONS = makeActionStrings('FETCH_QUESTIONS')
export const CREATE_QUESTION = makeActionStrings('CREATE_QUESTION')
export const UPDATE_QUESTION_ANSWERING = makeActionStrings(
  'UPDATE_QUESTION_ANSWERING'
)
export const UPDATE_QUESTION = makeActionStrings('UPDATE_QUESTION')
export const FINISH_ANSWERING_QUESTION = makeActionStrings(
  'FINISH_ANSWERING_QUESTION'
)
export const DELETE_QUESTION = makeActionStrings('DELETE_QUESTION')

export const DELETE_ALL_QUESTIONS = makeActionStrings('DELETE_ALL_QUESTIONS')

export const FETCH_CURRENT_USER = makeActionStrings('FETCH_CURRENT_USER')
export const UPDATE_USER_PREFERRED_NAME = makeActionStrings(
  'UPDATE_USER_PREFERRED_NAME'
)

/* These events will be fired on websocket messages */
export const REPLACE_QUESTIONS = 'REPLACE_QUESTIONS'
export const UPDATE_QUEUES = 'UPDATE_QUEUES'
export const REPLACE_ACTIVE_STAFF = 'REPLACE_ACTIVE_STAFF'

/* Actions for socket status */
export const SET_SOCKET_STATUS = 'SET_SOCKET_STATUS'
export const SET_SOCKET_ERROR = 'SET_SOCKET_ERROR'
export const RESET_SOCKET_STATE = 'RESET_SOCKET_STATE'
