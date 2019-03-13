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
import { isUserCourseStaff, isUserAdmin } from '../selectors'
import ConfidentialQueuePanelContainer from '../containers/ConfidentialQueuePanelContainer'

class Queue extends React.Component {
  static getInitialProps({ isServer, store, query }) {
    const queueId = Number.parseInt(query.id, 10)
    if (isServer) {
      store.dispatch(fetchQueueRequest(queueId))
    }
    return {
      queueId,
      isFetching: isServer,
    }
  }

  static pageTransitionDelayEnter = true

  componentDidMount() {
    this.props.fetchQueue(this.props.queueId).then(() => {
      if (this.props.pageTransitionReadyToEnter) {
        this.props.pageTransitionReadyToEnter()
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFetching && !this.props.isFetching && this.props.hasQueue) {
      // We have finished fetching the queue and the queue exists (was not a 404)
      // It's now safe to connect to the websocket
      connectToQueue(this.props.dispatch, this.props.queueId)
    }
  }

  componentWillUnmount() {
    disconnectFromQueue(this.props.queueId)
  }

  render() {
    const { isFetching, hasQueue } = this.props

    if (isFetching) {
      return null
    }
    if (!isFetching && !hasQueue) {
      return <Error statusCode={404} />
    }
    const locationText = this.props.queue.location || 'No location specified'
    const confidentialMessage =
      this.props.isUserCourseStaff || this.props.isUserAdmin
        ? 'Students'
        : 'You'

    let queueName = ''
    const { name, courseName } = this.props.queue
    if (courseName) {
      queueName += `${courseName} — `
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
      </Container>
    )
  }
}

Queue.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  hasQueue: PropTypes.bool.isRequired,
  fetchQueue: PropTypes.func.isRequired,
  queueId: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
  queue: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    courseName: PropTypes.string,
    location: PropTypes.string,
    isConfidential: PropTypes.bool,
    courseId: PropTypes.number,
    open: PropTypes.bool,
    message: PropTypes.string,
    messageEnabled: PropTypes.bool,
  }),
  pageTransitionReadyToEnter: PropTypes.func,
}

Queue.defaultProps = {
  queue: null,
  pageTransitionReadyToEnter: null,
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.queues.isFetching,
  hasQueue: !!state.queues.queues[ownProps.queueId],
  queue: state.queues.queues[ownProps.queueId],
  isUserCourseStaff: isUserCourseStaff(state, ownProps),
  isUserAdmin: isUserAdmin(state, ownProps),
})

const mapDispatchToProps = dispatch => ({
  fetchQueue: queueId => dispatch(fetchQueue(queueId)),
  dispatch,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWithUser(Queue))
