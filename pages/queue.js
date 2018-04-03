import React from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'reactstrap'
import withRedux from 'next-redux-wrapper'
import Error from 'next/error'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faMapMarker from '@fortawesome/fontawesome-free-solid/faMapMarker'

import makeStore from '../redux/makeStore'
import { fetchQueue, fetchQueueRequest } from '../actions/queue'
import { connectToQueue, disconnectFromQueue } from '../socket/client'

import { isUserStudent } from '../selectors'

import PageWithUser from '../components/PageWithUser'
import Loading from '../components/Loading'
import Layout from '../components/Layout'
import StaffSidebar from '../components/StaffSidebar'
import QuestionPanelContainer from '../containers/QuestionPanelContainer'
import QuestionListContainer from '../containers/QuestionListContainer'
import QuestionNotificationsToggle from '../components/QuestionNotificationsToggle'

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

  componentDidMount() {
    this.props.fetchQueue(this.props.queueId)
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
    const { isFetching, isStudent, hasQueue } = this.props

    if (isFetching) {
      return <Loading />
    }
    if (!isFetching && !hasQueue) {
      return <Error statusCode={404} />
    }
    const locationText = this.props.queue.location || 'No location specified'
    return (
      <Layout>
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
              <QuestionNotificationsToggle isStudent={isStudent} />
              <StaffSidebar queueId={this.props.queueId} />
            </Col>
            <Col xs={{ size: 12 }} md={{ size: 8 }} lg={{ size: 9 }}>
              <QuestionPanelContainer queueId={this.props.queueId} />
              <QuestionListContainer queueId={this.props.queueId} />
            </Col>
          </Row>
        </Container>
      </Layout>
    )
  }
}

Queue.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isStudent: PropTypes.bool.isRequired,
  hasQueue: PropTypes.bool.isRequired,
  fetchQueue: PropTypes.func.isRequired,
  queueId: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  queue: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    location: PropTypes.string,
  }),
}

Queue.defaultProps = {
  queue: null,
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.queues.isFetching,
  isStudent: isUserStudent(state, ownProps),
  hasQueue: !!state.queues.queues[ownProps.queueId],
  queue: state.queues.queues[ownProps.queueId],
})

const mapDispatchToProps = dispatch => ({
  fetchQueue: queueId => dispatch(fetchQueue(queueId)),
  dispatch,
})

export default withRedux(makeStore, mapStateToProps, mapDispatchToProps)(
  PageWithUser(Queue)
)
