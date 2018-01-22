import axios from 'axios'
import * as types from '../constants/ActionTypes'

/************************
 * Creating a new course
 ************************/
function createCourseRequest(course) {
  return {
    type: types.CREATE_COURSE_REQUEST,
    course
  }
}

function createCourseSuccess(course) {
  return {
    type: types.CREATE_COURSE_SUCCESS,
    course
  }
}

function createCourseFailure(course) {
  return {
    type: types.CREATE_COURSE_FAILURE,
    course
  }
}

export function createCourse(course) {
  return (dispatch) => {
    dispatch(createCourseRequest(course))

    return axios.post(`/api/courses`, {
      name: course.name
    })
    .then(res => dispatch(createCourseSuccess(res.data)))
    .catch(err => {
      console.error(err)
      dispatch(createCourseFailure())
    })
  }
}

/**********************
 * Loading all courses
**********************/
export function requestCourses() {
  return {
    type: types.FETCH_COURSES_REQUEST
  }
}

function requestCoursesSuccess(courses) {
  return {
    type: types.FETCH_COURSES_SUCCESS,
    courses
  }
}

function requestCoursesFailure() {
  return {
    type: types.FETCH_COURSES_FAILURE
  }
}

export function fetchCourses() {
  return (dispatch) => {
    dispatch(requestCourses())

    return axios.get(`/api/courses`)
    .then(res => dispatch(requestCoursesSuccess(res.data)))
    .catch(err => {
      console.error(err)
      dispatch(requestCoursesFailure())
    })
  }
}

/**********************
 * Loading all courses
**********************/
export function requestCourse(courseId) {
  return {
    type: types.FETCH_COURSE_REQUEST,
    courseId
  }
}

function requestCourseSuccess(courseId, course) {
  return {
    type: types.FETCH_COURSE_SUCCESS,
    courseId,
    course
  }
}

function requestCourseFailure() {
  return {
    type: types.FETCH_COURSE_FAILURE
  }
}

export function fetchCourse(courseId) {
  return (dispatch) => {
    dispatch(requestCourse(courseId))

    return axios.get(`/api/courses/${courseId}`)
    .then(res => dispatch(requestCourseSuccess(courseId, res.data)))
    .catch(err => {
      console.error(err)
      dispatch(requestCourseFailure())
    })
  }
}
