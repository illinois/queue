import { connect } from 'react-redux'

import {
  getUserActiveQuestionIdForQueue,
  isUserActiveStaffForQueue,
} from '../selectors'

import QuestionPanel from '../components/QuestionPanel'

const mapStateToProps = (state, ownProps) => ({
  user: state.user.user,
  userActiveQuestionId: getUserActiveQuestionIdForQueue(state, ownProps),
  isUserActiveStaff: isUserActiveStaffForQueue(state, ownProps),
})

export default connect(mapStateToProps, null)(QuestionPanel)
