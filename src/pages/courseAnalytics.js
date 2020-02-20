import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Error from '../components/Error'
import PageWithUser from '../components/PageWithUser'
import { isUserCourseStaff, isUserAdmin } from '../selectors'

const CourseAnalytics = props => {
  if (props.isUserAdmin && props.isUserCourseStaff) {
    return <Error statusCode={403} />
  }

  return <div>Hi! Place the graphs here.</div>
}

CourseAnalytics.propTypes = {
  courseId: PropTypes.number.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  isUserCourseStaff: isUserCourseStaff(state, ownProps),
  isUserAdmin: isUserAdmin(state, ownProps),
})

export default connect(mapStateToProps)(PageWithUser(CourseAnalytics))
