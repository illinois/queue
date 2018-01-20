import { connect } from 'react-redux'
import { createQuestion } from '../actions'

import NewQuestion from '../components/NewQuestion'

function mapStateToProps(state, ownProps) {
  // TODO expose current user so we can autofill the name field
  return {
    queueId: ownProps.queueId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createQuestion: (question) => dispatch(createQuestion(question))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewQuestion)
