import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'reactstrap'
import { connect } from 'react-redux'

import { Router } from '../routes'
import {
  fetchQueue,
  fetchQueueRequest,
  updateQueue,
  deleteQueue,
} from '../actions/queue'
import Error from '../components/Error'
import GeneralPanel from '../components/queueSettings/GeneralPanel'
import AdmissionControlPanel from '../components/queueSettings/AdmissionControlPanel'
import PageWithUser from '../components/PageWithUser'
import DangerPanel from '../components/queueSettings/DangerPanel'
import { isUserCourseStaffForQueue, isUserAdmin } from '../selectors'

class QueueSettings extends React.Component {
  static async getInitialProps({ isServer, store, query }) {
    const queueId = Number.parseInt(query.id, 10)
    if (isServer) {
      store.dispatch(fetchQueueRequest(queueId))
    }
    return {
      queueId,
      isFetching: isServer,
    }
    // Nothing to do at the moment
  }

  componentDidMount() {
    this.props.fetchQueue(this.props.queueId).then(() => {
      if (this.props.pageTransitionReadyToEnter) {
        this.props.pageTransitionReadyToEnter()
      }
    })
  }

  updateQueue(attributes) {
    this.props.updateQueue(this.props.queueId, attributes)
  }

  deleteQueue() {
    const { id: queueId, courseId } = this.props.queue
    this.props.deleteQueue(courseId, queueId).then(() => {
      Router.replaceRoute('index')
    })
  }

  render() {
    if (!this.props.queue) return null
    if (!this.props.isUserAdmin && !this.props.isUserCourseStaffForQueue) {
      return <Error statusCode={403} />
    }
    return (
      <Container>
        <h1 className="display-4">Queue Settings</h1>
        <h2 className="mb-5">{this.props.queue.name}</h2>
        <GeneralPanel
          queue={this.props.queue}
          updateQueue={attributes => this.updateQueue(attributes)}
        />
        <AdmissionControlPanel
          queue={this.props.queue}
          updateQueue={attributes => this.updateQueue(attributes)}
        />
        <DangerPanel deleteQueue={() => this.deleteQueue()} />
      </Container>
    )
  }
}

QueueSettings.propTypes = {
  fetchQueue: PropTypes.func.isRequired,
  updateQueue: PropTypes.func.isRequired,
  deleteQueue: PropTypes.func.isRequired,
  queueId: PropTypes.number.isRequired,
  queue: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    courseId: PropTypes.number,
    admissionControlEnabled: PropTypes.bool,
    admissionControlUrl: PropTypes.string,
  }),
  isUserCourseStaffForQueue: PropTypes.bool.isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
  pageTransitionReadyToEnter: PropTypes.func,
}

QueueSettings.defaultProps = {
  queue: null,
  pageTransitionReadyToEnter: null,
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.queues.isFetching,
  hasQueue: !!state.queues.queues[ownProps.queueId],
  queue: state.queues.queues[ownProps.queueId],
  isUserCourseStaffForQueue: isUserCourseStaffForQueue(state, ownProps),
  isUserAdmin: isUserAdmin(state, ownProps),
  user: state.user.user,
})

const mapDispatchToProps = dispatch => ({
  fetchQueue: queueId => dispatch(fetchQueue(queueId)),
  updateQueue: (queueId, attributes) =>
    dispatch(updateQueue(queueId, attributes)),
  deleteQueue: (courseId, queueId) => dispatch(deleteQueue(courseId, queueId)),
  dispatch,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWithUser(QueueSettings))
