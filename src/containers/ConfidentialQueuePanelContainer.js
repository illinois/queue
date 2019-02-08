import { connect } from 'react-redux'

import ConfidentialQueuePanel from '../components/ConfidentialQueuePanel'

const mapStateToProps = (state, props) => ({
  queue: state.queues.queues[props.queueId],
  questions: state.questions.questions,
  userId: state.user.user.id,
})

export default connect(mapStateToProps)(ConfidentialQueuePanel)
