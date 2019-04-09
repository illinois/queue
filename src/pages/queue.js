import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { usePrevious } from 'react-hanger'
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

import { Link } from '../routes'
import { fetchQueue } from '../actions/queue'
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
import { FETCH_QUEUE } from '../constants/ActionTypes'
import {
  SOCKET_CONNECTING,
  SOCKET_CONNECTED,
  SOCKET_ERROR,
  SOCKET_AUTHENTICATION_ERROR,
} from '../constants/socketStatus'
import SocketStatusAlert from '../components/SocketStatusAlert'

const buildQueueName = (queue, course) => {
  return (
    <>
      {course && (
        <>
          <Link route="course" params={{ id: course.id }}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>{course.name}</a>
          </Link>
          <span className="mx-1">/</span>
        </>
      )}
      {queue.name}
    </>
  )
}

const Queue = props => {
  const [queueLoading, setQueueLoading] = useState(true)
  const [showSocketStatus, setShowSocketStatus] = useState(false)
  const previousSocketStatus = usePrevious(props.socketStatus)

  useEffect(() => {
    setQueueLoading(true)
    props.fetchQueue(props.queueId).then(action => {
      setQueueLoading(false)
      if (props.pageTransitionReadyToEnter) {
        props.pageTransitionReadyToEnter()
      }
      if (action.type === FETCH_QUEUE.SUCCESS) {
        props.fetchCourse(action.queue.courseId)
      }
    })
  }, [props.queueId])

  useEffect(() => {
    connectToQueue(props.dispatch, props.queueId)
    return () => {
      disconnectFromQueue(props.queueId)
      resetSocketState()
    }
  }, [props.queueId])

  useEffect(() => {
    const NOOP = () => {}
    if (previousSocketStatus === props.socketStatus) return NOOP
    if (
      previousSocketStatus === SOCKET_CONNECTED &&
      props.socketStatus !== SOCKET_CONNECTED
    ) {
      setShowSocketStatus(true)
      return NOOP
    }
    if (
      props.socketStatus === SOCKET_ERROR ||
      props.socketStatus === SOCKET_AUTHENTICATION_ERROR
    ) {
      setShowSocketStatus(true)
      return NOOP
    }
    if (props.socketStatus === SOCKET_CONNECTED) {
      const timeoutId = setTimeout(() => {
        setShowSocketStatus(false)
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
    return NOOP
  }, [props.socketStatus])

  if (queueLoading) {
    return null
  }

  if (!queueLoading && !props.queue) {
    return <Error statusCode={404} />
  }

  const queueName = buildQueueName(props.queue, props.course)
  const locationText = props.queue.location || 'No location specified'
  const confidentialMessage =
    props.isUserCourseStaff || props.isUserAdmin ? 'Students' : 'You'
  return (
    <Container fluid>
      <SocketStatusAlert
        status={props.socketStatus}
        isOpen={showSocketStatus}
      />
      <h3>
        {props.queue.isConfidential && (
          <span>
            <FontAwesomeIcon
              icon={faEyeSlash}
              fixedWidth
              className="mr-2"
              id="confidentialIcon"
            />
            <UncontrolledTooltip placement="bottom" target="confidentialIcon">
              This is a confidential queue! {confidentialMessage} won&apos;t be
              able to see questions from other students.
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
          <ShowForCourseStaff queueId={props.queueId}>
            <QueueStatusToggleContainer queue={props.queue} />
            {!props.queue.open && (
              <DeleteAllQuestionsButtonContainer queue={props.queue} />
            )}
            <QueueMessageEnabledToggleContainer queue={props.queue} />
          </ShowForCourseStaff>
          <StaffSidebar queueId={props.queueId} />
        </Col>
        <Col xs={{ size: 12 }} md={{ size: 8 }} lg={{ size: 9 }}>
          <Collapse isOpen={props.queue.messageEnabled}>
            <QueueMessageContainer queueId={props.queueId} />
          </Collapse>
          {props.queue.open && (
            <QuestionPanelContainer queueId={props.queueId} />
          )}
          {!props.queue.open && (
            <Card className="bg-light mb-3">
              <CardBody className="text-center">
                This queue is closed. Check back later!
              </CardBody>
            </Card>
          )}
          {props.queue.isConfidential &&
            !props.isUserCourseStaff &&
            !props.isUserAdmin && (
              <ConfidentialQueuePanelContainer queueId={props.queueId} />
            )}
          <QuestionListContainer queueId={props.queueId} />
        </Col>
      </Row>
      <SocketErrorModal
        isOpen={props.socketStatus === SOCKET_AUTHENTICATION_ERROR}
      />
    </Container>
  )
}

Queue.getInitialProps = async ({ query }) => {
  const queueId = Number.parseInt(query.id, 10)
  return { queueId }
}

Queue.pageTransitionDelayEnter = true

Queue.propTypes = {
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
  socketStatus: PropTypes.string,
}

Queue.defaultProps = {
  queue: null,
  course: null,
  pageTransitionReadyToEnter: null,
  socketStatus: SOCKET_CONNECTING,
}

const mapStateToProps = (state, ownProps) => {
  const queue = state.queues.queues[ownProps.queueId]
  const course = queue && state.courses.courses[queue.courseId]
  return {
    queue,
    course,
    isUserCourseStaff: isUserCourseStaffForQueue(state, ownProps),
    isUserAdmin: isUserAdmin(state, ownProps),
    socketStatus: state.socket.status,
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
