import { connect } from 'react-redux'
import { createQuestion } from '../actions/question'

import { isUserCourseStaffForQueue, isUserAdmin } from '../selectors'
import NewQuestion from '../components/NewQuestion'

function mapStateToProps(state, ownProps) {
  return {
    user: state.user.user,
    queueId: ownProps.queueId,
    queue: state.queues.queues[ownProps.queueId],
    questionError: state.questions.error,
    isUserCourseStaff:
      isUserCourseStaffForQueue(state, ownProps) ||
      isUserAdmin(state, ownProps),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createQuestion: (queueId, question) =>
      dispatch(createQuestion(queueId, question)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewQuestion)
