import axios from './axios'
import * as types from '../constants/ActionTypes'
import { makeActionCreator } from './util'

/**
 * Creating a new course
 */
const createCourseRequest = makeActionCreator(
  types.CREATE_COURSE.REQUEST,
  'course'
)
const createCourseSuccess = makeActionCreator(
  types.CREATE_COURSE.SUCCESS,
  'course'
)
const createCourseFailure = makeActionCreator(
  types.CREATE_COURSE.FAILURE,
  'data'
)

export function createCourse(course) {
  return dispatch => {
    dispatch(createCourseRequest(course))
    return axios.post('/api/courses', course).then(
      res => {
        dispatch(createCourseSuccess(res.data))
      },
      err => {
        console.error(err)
        dispatch(createCourseFailure(err))
      }
    )
  }
}

/**
 * Update a course's attributes
 */
const updateCourseRequest = makeActionCreator(
  types.UPDATE_COURSE.REQUEST,
  'courseId',
  'attributes'
)
export const updateCourseSuccess = makeActionCreator(
  types.UPDATE_COURSE.SUCCESS,
  'courseId',
  'course'
)
const updateCourseFailure = makeActionCreator(
  types.UPDATE_COURSE.FAILURE,
  'courseId'
)

export function updateCourse(courseId, attributes) {
  return dispatch => {
    dispatch(updateCourseRequest(courseId, attributes))
    return axios.patch(`/api/courses/${courseId}`, attributes).then(
      res => dispatch(updateCourseSuccess(courseId, res.data)),
      err => {
        console.error(err)
        dispatch(updateCourseFailure(courseId))
      }
    )
  }
}

/**
 * Loading all courses
 */
export const fetchCoursesRequest = makeActionCreator(
  types.FETCH_COURSES.REQUEST
)
const fetchCoursesSuccess = makeActionCreator(
  types.FETCH_COURSES.SUCCESS,
  'courses'
)
const fetchCoursesFailure = makeActionCreator(
  types.FETCH_COURSES.FAILURE,
  'data'
)

export function fetchCourses() {
  return dispatch => {
    dispatch(fetchCoursesRequest())

    return axios.get('/api/courses').then(
      res => dispatch(fetchCoursesSuccess(res.data)),
      err => {
        console.error(err)
        dispatch(fetchCoursesFailure(err))
      }
    )
  }
}

/**
 * Loading a specific course
 */
export const fetchCourseRequest = makeActionCreator(
  types.FETCH_COURSE.REQUEST,
  'courseId'
)
const fetchCourseSuccess = makeActionCreator(
  types.FETCH_COURSE.SUCCESS,
  'courseId',
  'course'
)
const fetchCourseFailure = makeActionCreator(types.FETCH_COURSE.FAILURE, 'data')

export function fetchCourse(courseId) {
  return dispatch => {
    dispatch(fetchCourseRequest(courseId))

    return axios.get(`/api/courses/${courseId}`).then(
      res => dispatch(fetchCourseSuccess(courseId, res.data)),
      err => {
        console.error(err)
        dispatch(fetchCourseFailure(err))
      }
    )
  }
}

/**
 * Add a user as staff for a course
 */
const addCourseStaffRequest = makeActionCreator(
  types.ADD_COURSE_STAFF.REQUEST,
  'courseId',
  'userId'
)
const addCourseStaffSuccess = makeActionCreator(
  types.ADD_COURSE_STAFF.SUCCESS,
  'courseId',
  'user'
)
const addCourseStaffFailure = makeActionCreator(
  types.ADD_COURSE_STAFF.FAILURE,
  'data'
)

export function addCourseStaff(courseId, userId) {
  return dispatch => {
    dispatch(addCourseStaffRequest(courseId, userId))

    return axios.put(`/api/courses/${courseId}/staff/${userId}`).then(
      res => dispatch(addCourseStaffSuccess(courseId, res.data)),
      err => {
        console.error(err)
        dispatch(addCourseStaffFailure(err))
      }
    )
  }
}

/**
 * Remove a user as staff for a course
 */
const removeCourseStaffRequest = makeActionCreator(
  types.REMOVE_COURSE_STAFF.REQUEST,
  'courseId',
  'userId'
)
const removeCourseStaffSuccess = makeActionCreator(
  types.REMOVE_COURSE_STAFF.SUCCESS,
  'courseId',
  'userId'
)
const removeCourseStaffFailure = makeActionCreator(
  types.REMOVE_COURSE_STAFF.FAILURE,
  'data'
)

export function removeCourseStaff(courseId, userId) {
  return dispatch => {
    dispatch(removeCourseStaffRequest(courseId, userId))

    return axios.delete(`/api/courses/${courseId}/staff/${userId}`).then(
      () => dispatch(removeCourseStaffSuccess(courseId, userId)),
      err => {
        console.error(err)
        dispatch(removeCourseStaffFailure(err))
      }
    )
  }
}
