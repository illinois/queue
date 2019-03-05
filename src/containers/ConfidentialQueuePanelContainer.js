import { connect } from 'react-redux'

import ConfidentialQueuePanel from '../components/ConfidentialQueuePanel'
import { getUserActiveQuestionIdForQueue } from '../selectors'

const mapStateToProps = (state, props) => ({
  queue: state.queues.queues[props.queueId],
  questions: state.questions.questions,
  getUserActiveQuestionIdForQueue: getUserActiveQuestionIdForQueue(
    state,
    props
  ),
})

export default connect(mapStateToProps)(ConfidentialQueuePanel)
