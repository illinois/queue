import { connect } from 'react-redux'

import { deleteAllQuestions } from '../actions/question'
import DeleteAllQuestionsToggle from '../components/DeleteAllQuestionsToggle'

const mapDispatchToProps = dispatch => ({
  deleteAllQuestions: queueId => dispatch(deleteAllQuestions(queueId)),
})

export default connect(
  null,
  mapDispatchToProps
)(DeleteAllQuestionsToggle)
