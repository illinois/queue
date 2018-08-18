import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  isUserAdmin,
  isUserCourseStaff,
  isUserCourseStaffForQueue,
} from '../selectors'

const ShowForCourseStaff = ({
  isAdmin,
  isCourseStaff,
  isCourseStaffForQueue,
  children,
}) => {
  // Admins can do everything course staff can
  if (isAdmin || isCourseStaff || isCourseStaffForQueue) {
    return children
  }
  return null
}

ShowForCourseStaff.defaultProps = {
  courseId: null,
  queueId: null,
}

ShowForCourseStaff.propTypes = {
  courseId: PropTypes.number,
  queueId: PropTypes.number,
}

const mapStateToProps = (state, ownProps) => ({
  isCourseStaff: isUserCourseStaff(state, ownProps),
  isCourseStaffForQueue: isUserCourseStaffForQueue(state, ownProps),
  isAdmin: isUserAdmin(state),
})

export default connect(
  mapStateToProps,
  null
)(ShowForCourseStaff)
