import { connect } from 'react-redux'

import { deleteAllQuestions } from '../actions/question'
import DeleteAllQuestionsToggle from '../components/DeleteAllQuestionsToggle'

const mapDispatchToProps = dispatch => ({
  deleteAllQuestions: (queueId, attributes) =>
    dispatch(deleteAllQuestions(queueId, attributes)),
})

export default connect(
  null,
  mapDispatchToProps
)(DeleteAllQuestionsToggle)
