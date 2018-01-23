import { connect } from 'react-redux'
import {
  fetchQuestions,
  deleteQuestion,
} from '../actions/question'

import QuestionList from '../components/QuestionList'

function mapStateToProps(state, ownProps) {
  return {
    queue: state.queues.queues[ownProps.queueId],
    questions: state.questions.questions,
  }
}

const mapDispatchToProps = (dispatch, { queueId }) => ({
  fetchQuestions: () => dispatch(fetchQuestions(queueId)),
  deleteQuestion: questionId => dispatch(deleteQuestion(queueId, questionId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList)
