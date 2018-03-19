import { connect } from 'react-redux'
import { createQuestion } from '../actions/question'

import NewQuestion from '../components/NewQuestion'

function mapStateToProps(state, ownProps) {
  // TODO expose current user so we can autofill the name field
  return {
    queueId: ownProps.queueId,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createQuestion: (queueId, question) =>
      dispatch(createQuestion(queueId, question)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewQuestion)
