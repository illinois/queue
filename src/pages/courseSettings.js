import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Container } from 'reactstrap'
import { connect } from 'react-redux'

import {
  fetchCourse,
  fetchCourseRequest,
  addCourseStaff,
  removeCourseStaff,
  updateCourse as updateCourseAction,
} from '../actions/course'

import Error from '../components/Error'
import PageWithUser from '../components/PageWithUser'
import GeneralPanel from '../components/courseSettings/GeneralPanel'
import DownloadPanel from '../components/courseSettings/DownloadPanel'
import ManageStaffPanel from '../components/courseSettings/ManageStaffPanel'
import { isUserCourseStaff, isUserAdmin } from '../selectors'

const CourseSettings = props => {
  const [courseLoading, setCourseLoading] = useState(true)

  useEffect(() => {
    setCourseLoading(true)
    props.fetchCourse(props.courseId).then(() => {
      setCourseLoading(false)
      if (props.pageTransitionReadyToEnter) {
        props.pageTransitionReadyToEnter()
      }
    })
  }, [props.courseId])

  const updateCourse = attributes => {
    props.updateCourse(props.courseId, attributes)
  }

  if (courseLoading) return null

  if (!courseLoading && !props.course) {
    return <Error statusCode={404} />
  }

  if (!props.isUserAdmin && !props.isUserCourseStaff) {
    return <Error statusCode={403} />
  }

  return (
    <Container>
      <h1 className="display-4">Course Settings</h1>
      <h2 className="mb-5">{props.course.name}</h2>
      <GeneralPanel
        course={props.course}
        isAdmin={props.isUserAdmin}
        updateCourse={attributes => updateCourse(attributes)}
      />
      <ManageStaffPanel
        course={props.course}
        users={props.users}
        removeCourseStaff={props.removeCourseStaff}
        addCourseStaff={props.addCourseStaff}
      />
      <DownloadPanel course={props.course} />
    </Container>
  )
}

CourseSettings.getInitialProps = async ({ isServer, store, query }) => {
  const courseId = Number.parseInt(query.id, 10)
  if (isServer) {
    store.dispatch(fetchCourseRequest(courseId))
  }
  return { courseId }
}

CourseSettings.pageTransitionDelayEnter = true

CourseSettings.propTypes = {
  courseId: PropTypes.number.isRequired,
  fetchCourse: PropTypes.func.isRequired,
  addCourseStaff: PropTypes.func.isRequired,
  removeCourseStaff: PropTypes.func.isRequired,
  updateCourse: PropTypes.func.isRequired,
  course: PropTypes.shape({
    name: PropTypes.string,
    staff: PropTypes.arrayOf(PropTypes.number),
  }),
  users: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number,
      uid: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
  pageTransitionReadyToEnter: PropTypes.func,
}

CourseSettings.defaultProps = {
  course: null,
  pageTransitionReadyToEnter: null,
}

const mapStateToProps = (state, ownProps) => ({
  course: state.courses.courses[ownProps.courseId],
  isUserCourseStaff: isUserCourseStaff(state, ownProps),
  isUserAdmin: isUserAdmin(state, ownProps),
  users: state.users.users,
})

const mapDispatchToProps = dispatch => ({
  fetchCourse: courseId => dispatch(fetchCourse(courseId)),
  addCourseStaff: (courseId, uid, name) =>
    dispatch(addCourseStaff(courseId, uid, name)),
  removeCourseStaff: (courseId, userId) =>
    dispatch(removeCourseStaff(courseId, userId)),
  updateCourse: (courseId, attributes) =>
    dispatch(updateCourseAction(courseId, attributes)),
  dispatch,
})

const permissions = { requireCourseStaff: true }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWithUser(CourseSettings, permissions))
