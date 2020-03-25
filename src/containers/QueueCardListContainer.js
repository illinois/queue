import { connect } from 'react-redux'

import { updateQueue, deleteQueue } from '../actions/queue'
import QueueCardList from '../components/QueueCardList'

function mapStateToProps(state) {
  return {
    queues: state.queues.queues,
    courses: state.courses.courses,
  }
}

const mapDispatchToProps = dispatch => ({
  updateQueue: (queueId, attributes) =>
    dispatch(updateQueue(queueId, attributes)),
  deleteQueue: (courseId, queueId) => dispatch(deleteQueue(courseId, queueId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(QueueCardList)
