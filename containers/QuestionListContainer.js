import { connect } from 'react-redux'
import { fetchQuestions } from '../actions'

import QuestionList from '../components/QuestionList'

function mapStateToProps(state, ownProps) {
  return {
    questions: state.questions,
    queueId: ownProps.queueId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchQuestions: (queueId) => dispatch(fetchQuestions(queueId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList)
