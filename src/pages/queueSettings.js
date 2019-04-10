import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Container } from 'reactstrap'
import { connect } from 'react-redux'

import { Router } from '../routes'
import {
  fetchQueue,
  fetchQueueRequest,
  updateQueue as updateQueueAction,
  deleteQueue as deleteQueueAction,
} from '../actions/queue'
import Error from '../components/Error'
import GeneralPanel from '../components/queueSettings/GeneralPanel'
import AdmissionControlPanel from '../components/queueSettings/AdmissionControlPanel'
import PageWithUser from '../components/PageWithUser'
import DangerPanel from '../components/queueSettings/DangerPanel'
import { isUserCourseStaffForQueue, isUserAdmin } from '../selectors'

const QueueSettings = props => {
  const [queueLoading, setQueueLoading] = useState(true)

  useEffect(() => {
    setQueueLoading(true)
    props.fetchQueue(props.queueId).then(() => {
      setQueueLoading(false)
      if (props.pageTransitionReadyToEnter) {
        props.pageTransitionReadyToEnter()
      }
    })
  }, [props.queueId])

  const updateQueue = attributes => {
    props.updateQueue(props.queueId, attributes)
  }

  const deleteQueue = () => {
    const { id: queueId, courseId } = props.queue
    props.deleteQueue(courseId, queueId).then(() => {
      Router.replaceRoute('index')
    })
  }

  if (queueLoading) return null

  if (!queueLoading && !props.queue) {
    return <Error statusCode={404} />
  }

  if (!props.isUserAdmin && !props.isUserCourseStaffForQueue) {
    return <Error statusCode={403} />
  }

  return (
    <Container>
      <h1 className="display-4">Queue Settings</h1>
      <h2 className="mb-5">{props.queue.name}</h2>
      <GeneralPanel
        queue={props.queue}
        updateQueue={attributes => updateQueue(attributes)}
      />
      <AdmissionControlPanel
        queue={props.queue}
        updateQueue={attributes => updateQueue(attributes)}
      />
      <DangerPanel deleteQueue={() => deleteQueue()} />
    </Container>
  )
}

QueueSettings.getInitialProps = async ({ isServer, store, query }) => {
  const queueId = Number.parseInt(query.id, 10)
  if (isServer) {
    store.dispatch(fetchQueueRequest(queueId))
  }
  return { queueId }
}

QueueSettings.pageTransitionDelayEnter = true

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
  queue: state.queues.queues[ownProps.queueId],
  isUserCourseStaffForQueue: isUserCourseStaffForQueue(state, ownProps),
  isUserAdmin: isUserAdmin(state, ownProps),
  user: state.user.user,
})

const mapDispatchToProps = dispatch => ({
  fetchQueue: queueId => dispatch(fetchQueue(queueId)),
  updateQueue: (queueId, attributes) =>
    dispatch(updateQueueAction(queueId, attributes)),
  deleteQueue: (courseId, queueId) =>
    dispatch(deleteQueueAction(courseId, queueId)),
  dispatch,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWithUser(QueueSettings))
