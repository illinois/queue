import { connect } from 'react-redux'

import { deleteAllQuestions } from '../actions/question'
import DeleteAllQuestionsButton from '../components/DeleteAllQuestionsButton'

const mapDispatchToProps = dispatch => ({
  deleteAllQuestions: queueId => dispatch(deleteAllQuestions(queueId)),
})

export default connect(
  null,
  mapDispatchToProps
)(DeleteAllQuestionsButton)
