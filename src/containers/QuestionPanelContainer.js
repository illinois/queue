import { connect } from 'react-redux'

import {
  getUserActiveQuestionIdForQueue,
  isUserCourseStaffForQueue,
} from '../selectors'

import QuestionPanel from '../components/QuestionPanel'

const mapStateToProps = (state, ownProps) => ({
  user: state.user.user,
  userActiveQuestionId: getUserActiveQuestionIdForQueue(state, ownProps),
  isUserCourseStaff: isUserCourseStaffForQueue(state, ownProps),
})

export default connect(
  mapStateToProps,
  null
)(QuestionPanel)
