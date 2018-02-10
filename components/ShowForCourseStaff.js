import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { isUserAdmin, isUserCourseStaff } from '../selectors'

const ShowForAdmin = ({ isAdmin, isCourseStaff, children }) => {
  // Admins can do everything course staff can
  if (isAdmin || isCourseStaff) {
    return children
  }
  return null
}

ShowForAdmin.propTypes = {
  courseId: PropTypes.number.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  isCourseStaff: isUserCourseStaff(state, ownProps),
  isAdmin: isUserAdmin(state),
})

export default connect(mapStateToProps, null)(ShowForAdmin)
