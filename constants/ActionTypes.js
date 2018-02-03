export const ADD_STAFF = 'ADD_STAFF'
export const UPDATE_STAFF = 'UPDATE_STAFF'
export const REMOVE_STAFF = 'REMOVE_STAFF'
export const REPLACE_STAFF = 'REPLACE_STAFF'


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


export const FETCH_QUEUE = makeActionStrings('FETCH_QUEUE')
export const CREATE_QUEUE = makeActionStrings('CREATE_QUEUE')
export const DELETE_QUEUE = makeActionStrings('DELETE_QUEUE')


export const FETCH_QUESTIONS = makeActionStrings('FETCH_QUESTIONS')
export const CREATE_QUESTION = makeActionStrings('CREATE_QUESTION')
export const UPDATE_QUESTION_ANSWERING = makeActionStrings('UPDATE_QUESTION_ANSWERING')
export const FINISH_ANSWERING_QUESTION = makeActionStrings('FINISH_ANSWERING_QUESTION')
export const DELETE_QUESTION = makeActionStrings('DELETE_QUESTION')

export const FETCH_CURRENT_USER = makeActionStrings('FETCH_CURRENT_USER')


/* These events will be fired on websocket messages */
export const UPDATE_QUESTIONS = 'UPDATE_QUESTIONS'
export const UPDATE_QUEUES = 'UPDATE_QUEUES'
