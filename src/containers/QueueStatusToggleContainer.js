import { connect } from 'react-redux'

import { updateQueue } from '../actions/queue'
import QueueStatusToggle from '../components/QueueStatusToggle'

const mapDispatchToProps = dispatch => ({
  updateQueue: (queueId, attributes) =>
    dispatch(updateQueue(queueId, attributes)),
})

export default connect(null, mapDispatchToProps)(QueueStatusToggle)
