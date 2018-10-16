import { connect } from 'react-redux'

import { updateQueue } from '../actions/queue'
import { isUserCourseStaffForQueue, isUserAdmin } from '../selectors'

import QueueMessage from '../components/QueueMessage'

const mapStateToProps = (state, ownProps) => {
  const queue = state.queues.queues[ownProps.queueId]
  return {
    message: queue ? queue.message : null,
    isUserCourseStaff:
      isUserCourseStaffForQueue(state, ownProps) ||
      isUserAdmin(state, ownProps),
  }
}

const mapDispatchToProps = dispatch => ({
  updateQueue: (queueId, attributes) =>
    dispatch(updateQueue(queueId, attributes)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QueueMessage)
