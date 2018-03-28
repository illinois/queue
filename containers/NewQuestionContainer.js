import { connect } from 'react-redux'
import { createQuestion } from '../actions/question'

import NewQuestion from '../components/NewQuestion'

function mapStateToProps(state, ownProps) {
  return {
    user: state.user.user,
    queueId: ownProps.queueId,
    queue: state.queues.queues[ownProps.queueId],
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createQuestion: (queueId, question) =>
      dispatch(createQuestion(queueId, question)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewQuestion)
