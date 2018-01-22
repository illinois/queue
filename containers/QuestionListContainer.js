import { connect } from 'react-redux'
import { fetchQuestions } from '../actions/question'

import QuestionList from '../components/QuestionList'

function mapStateToProps(state, ownProps) {
  return {
    queue: state.queues.queues[ownProps.queueId],
    questions: state.questions.questions,
    queueId: ownProps.queueId,
  }
}

const mapDispatchToProps = dispatch => ({
  fetchQuestions: queueId => dispatch(fetchQuestions(queueId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList)
