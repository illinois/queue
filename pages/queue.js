import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Row,
  Col,
} from 'reactstrap'
import withRedux from 'next-redux-wrapper'

import makeStore from '../redux/makeStore'
import { fetchQueue } from '../actions/queue'
import { connectToQueue, disconnectFromQueue } from '../socket/client'

import PageWithUser from '../components/PageWithUser'
import Layout from '../components/Layout'
import StaffSidebar from '../components/StaffSidebar'
import QuestionPanel from '../components/QuestionPanel'
import QuestionListContainer from '../containers/QuestionListContainer'
import ShowForCourseStaff from '../components/ShowForCourseStaff'
import QuestionNotificationsToggle from '../components/QuestionNotificationsToggle'


class Queue extends React.Component {
  static getInitialProps({ query }) {
    return {
      queueId: Number.parseInt(query.id, 10),
    }
  }

  componentDidMount() {
    this.props.fetchQueue(this.props.queueId)
    connectToQueue(this.props.dispatch, this.props.queueId)
  }

  componentWillUnmount() {
    disconnectFromQueue(this.props.queueId)
  }

  render() {
    return (
      <Layout>
        <Container fluid>
          <Row>
            <Col xs={{ size: 12 }} md={{ size: 4 }}  lg={{ size: 3 }} className="mb-3 mb-md-0">
              <ShowForCourseStaff queueId={this.props.queueId}>
                <QuestionNotificationsToggle />
              </ShowForCourseStaff>
              <StaffSidebar queueId={this.props.queueId} />
            </Col>
            <Col xs={{ size: 12 }} md={{ size: 8 }} lg={{ size: 9 }} className="mb-3">
              <QuestionPanel queueId={this.props.queueId} />
              <QuestionListContainer queueId={this.props.queueId} />
            </Col>
          </Row>
        </Container>
      </Layout>
    )
  }
}

Queue.propTypes = {
  fetchQueue: PropTypes.func.isRequired,
  queueId: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  fetchQueue: queueId => dispatch(fetchQueue(queueId)),
  dispatch,
})

export default withRedux(makeStore, null, mapDispatchToProps)(PageWithUser(Queue))
