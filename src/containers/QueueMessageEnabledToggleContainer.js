import { connect } from 'react-redux'

import { updateQueue } from '../actions/queue'
import QueueMessageEnabledToggle from '../components/QueueMessageEnabledToggle'

const mapDispatchToProps = dispatch => ({
  updateQueue: (queueId, attributes) =>
    dispatch(updateQueue(queueId, attributes)),
})

export default connect(null, mapDispatchToProps)(QueueMessageEnabledToggle)
