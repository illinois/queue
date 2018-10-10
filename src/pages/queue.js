import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Row, Col, Card, CardBody } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker } from '@fortawesome/free-solid-svg-icons'

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
import QueueMessageEnabledToggleContainer from '../containers/QueueMessageEnabledToggleContainer';

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
    return (
      <Container fluid>
        <h3>{this.props.queue.name}</h3>
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
              <QueueMessageEnabledToggleContainer queue={this.props.queue} />
            </ShowForCourseStaff>
            <StaffSidebar queueId={this.props.queueId} />
          </Col>
          <Col xs={{ size: 12 }} md={{ size: 8 }} lg={{ size: 9 }}>
            {this.props.queue.messageEnabled && (
              <QueueMessageContainer queueId={this.props.queueId} />
            )}
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
  queue: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    location: PropTypes.string,
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
})

const mapDispatchToProps = dispatch => ({
  fetchQueue: queueId => dispatch(fetchQueue(queueId)),
  dispatch,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWithUser(Queue))
