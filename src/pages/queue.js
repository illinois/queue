import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Collapse,
  UncontrolledTooltip,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import { fetchQueue, fetchQueueRequest } from '../actions/queue'
import { fetchCourse } from '../actions/course'
import { connectToQueue, disconnectFromQueue } from '../socket/client'

import PageWithUser from '../components/PageWithUser'
import Error from '../components/Error'
import StaffSidebar from '../components/StaffSidebar'
import QuestionPanelContainer from '../containers/QuestionPanelContainer'
import QuestionListContainer from '../containers/QuestionListContainer'
import QueueMessageContainer from '../containers/QueueMessageContainer'
import ShowForCourseStaff from '../components/ShowForCourseStaff'
import QuestionNotificationsToggle from '../components/QuestionNotificationsToggle'
import QueueStatusToggleContainer from '../containers/QueueStatusToggleContainer'
import DeleteAllQuestionsButtonContainer from '../containers/DeleteAllQuestionsButtonContainer'
import QueueMessageEnabledToggleContainer from '../containers/QueueMessageEnabledToggleContainer'
import { isUserCourseStaffForQueue, isUserAdmin } from '../selectors'
import ConfidentialQueuePanelContainer from '../containers/ConfidentialQueuePanelContainer'
import SocketErrorModal from '../components/SocketErrorModal'
import { resetSocketState } from '../actions/socket'

class Queue extends React.Component {
  static getInitialProps({ isServer, store, query }) {
    const queueId = Number.parseInt(query.id, 10)
    if (isServer) {
      store.dispatch(fetchQueueRequest(queueId))
    }
    return {
      queueId,
      isFetchingQueue: isServer,
    }
  }

  static pageTransitionDelayEnter = true

  componentDidMount() {
    this.props.fetchQueue(this.props.queueId).then(action => {
      if (this.props.pageTransitionReadyToEnter) {
        this.props.pageTransitionReadyToEnter()
      }
      // We won't block the page from showing while we load the course - we'll
      // simply show the course name as soon as it's available
      return this.props.fetchCourse(action.queue.courseId)
    })
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isFetchingQueue &&
      !this.props.isFetchingQueue &&
      this.props.hasQueue
    ) {
      // We have finished fetching the queue and the queue exists (was not a 404)
      // It's now safe to connect to the websocket
      connectToQueue(this.props.dispatch, this.props.queueId)
    }
  }

  componentWillUnmount() {
    disconnectFromQueue(this.props.queueId)
    resetSocketState()
  }

  render() {
    const { isFetchingQueue, hasQueue } = this.props

    if (isFetchingQueue) {
      return null
    }
    if (!isFetchingQueue && !hasQueue) {
      return <Error statusCode={404} />
    }
    const locationText = this.props.queue.location || 'No location specified'
    const confidentialMessage =
      this.props.isUserCourseStaff || this.props.isUserAdmin
        ? 'Students'
        : 'You'

    let queueName = ''
    const { name } = this.props.queue
    if (this.props.course) {
      queueName += `${this.props.course.name} — `
    }
    queueName += name
    return (
      <Container fluid>
        <h3>
          {this.props.queue.isConfidential && (
            <span>
              <FontAwesomeIcon
                icon={faEyeSlash}
                fixedWidth
                className="mr-2"
                id="confidentialIcon"
              />
              <UncontrolledTooltip placement="bottom" target="confidentialIcon">
                This is a confidential queue! {confidentialMessage} won&apos;t
                be able to see questions from other students.
              </UncontrolledTooltip>
            </span>
          )}
          {queueName}
        </h3>
        <h5 className="mb-3 text-muted">
          <FontAwesomeIcon icon={faMapMarker} fixedWidth className="mr-2" />
          {locationText}
        </h5>
        <Row>
          <Col
            xs={{ size: 12 }}
            md={{ size: 4 }}
            lg={{ size: 3 }}
            className="mb-3 mb-md-0"
          >
            <QuestionNotificationsToggle />
            <ShowForCourseStaff queueId={this.props.queueId}>
              <QueueStatusToggleContainer queue={this.props.queue} />
              {!this.props.queue.open && (
                <DeleteAllQuestionsButtonContainer queue={this.props.queue} />
              )}
              <QueueMessageEnabledToggleContainer queue={this.props.queue} />
            </ShowForCourseStaff>
            <StaffSidebar queueId={this.props.queueId} />
          </Col>
          <Col xs={{ size: 12 }} md={{ size: 8 }} lg={{ size: 9 }}>
            <Collapse isOpen={this.props.queue.messageEnabled}>
              <QueueMessageContainer queueId={this.props.queueId} />
            </Collapse>
            {this.props.queue.open && (
              <QuestionPanelContainer queueId={this.props.queueId} />
            )}
            {!this.props.queue.open && (
              <Card className="bg-light mb-3">
                <CardBody className="text-center">
                  This queue is closed. Check back later!
                </CardBody>
              </Card>
            )}
            {this.props.queue.isConfidential &&
              !this.props.isUserCourseStaff &&
              !this.props.isUserAdmin && (
                <ConfidentialQueuePanelContainer queueId={this.props.queueId} />
              )}
            <QuestionListContainer queueId={this.props.queueId} />
          </Col>
        </Row>
        <SocketErrorModal
          isOpen={!!this.props.socketError}
          error={this.props.socketError}
        />
      </Container>
    )
  }
}

Queue.propTypes = {
  isFetchingQueue: PropTypes.bool.isRequired,
  hasQueue: PropTypes.bool.isRequired,
  fetchQueue: PropTypes.func.isRequired,
  fetchCourse: PropTypes.func.isRequired,
  queueId: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
  queue: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    location: PropTypes.string,
    isConfidential: PropTypes.bool,
    courseId: PropTypes.number,
    open: PropTypes.bool,
    message: PropTypes.string,
    messageEnabled: PropTypes.bool,
  }),
  course: PropTypes.shape({
    name: PropTypes.string,
  }),
  pageTransitionReadyToEnter: PropTypes.func,
  socketError: PropTypes.string,
}

Queue.defaultProps = {
  queue: null,
  course: null,
  pageTransitionReadyToEnter: null,
  socketError: null,
}

const mapStateToProps = (state, ownProps) => {
  const queue = state.queues.queues[ownProps.queueId]
  const course = queue && state.courses.courses[queue.courseId]
  return {
    isFetchingQueue: state.queues.isFetching,
    hasQueue: !!queue,
    hasCourse: !!course,
    queue,
    course,
    isUserCourseStaff: isUserCourseStaffForQueue(state, ownProps),
    isUserAdmin: isUserAdmin(state, ownProps),
    socketError: state.socket.error,
  }
}

const mapDispatchToProps = dispatch => ({
  fetchQueue: queueId => dispatch(fetchQueue(queueId)),
  fetchCourse: courseId => dispatch(fetchCourse(courseId)),
  resetSocketState: () => dispatch(resetSocketState()),
  dispatch,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWithUser(Queue))
