import { connect } from 'react-redux'

import { updateQueueStatus } from '../actions/queue'
import QueueStatusToggle from '../components/QueueStatusToggle'

function mapStateToProps() {
  return {}
}

const mapDispatchToProps = dispatch => ({
  updateQueueStatus: (queueId, attributes) =>
    dispatch(updateQueueStatus(queueId, attributes)),
})

export default connect(mapStateToProps, mapDispatchToProps)(QueueStatusToggle)
