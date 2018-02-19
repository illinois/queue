import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  ListGroup,
  ListGroupItem,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Button,
} from 'reactstrap'
import withRedux from 'next-redux-wrapper'
import FlipMove from 'react-flip-move'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'

import { Link } from '../routes'
import makeStore from '../redux/makeStore'
import { fetchCourseRequest, fetchCourse } from '../actions/course'
import { createQueue, deleteQueue } from '../actions/queue'
import { isUserCourseStaff } from '../selectors'

import PageWithUser from '../components/PageWithUser'
import Layout from '../components/Layout'
import NewQueue from '../components/NewQueue'
import Queue from '../components/Queue'
import ShowForCourseStaff from '../components/ShowForCourseStaff'

import { connectToCourse, disconnectFromCourse } from '../socket/client'

class Course extends React.Component {
  static async getInitialProps({ isServer, store, query }) {
    if (isServer) {
      store.dispatch(fetchCourseRequest())
    }
    return {
      courseId: Number.parseInt(query.id, 10),
      isFetching: isServer,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      showCreateQueuePanel: false,
    }
  }

  componentDidMount() {
    this.props.fetchCourse(this.props.courseId)
    connectToCourse(this.props.dispatch, this.props.courseId)
  }

  componentWillUnmount() {
    disconnectFromCourse(this.props.courseId)
  }

  showCreateQueuePanel() {
    this.setState({
      showCreateQueuePanel: true,
    })
  }

  hideCreateQueuePanel() {
    this.setState({
      showCreateQueuePanel: false,
    })
  }

  createQueue(queue) {
    this.props.createQueue(this.props.courseId, queue).then(() => this.hideCreateQueuePanel())
  }

  deleteQueue(queueId) {
    this.props.deleteQueue(this.props.courseId, queueId)
  }

  render() {
    let content
    if (this.props.isFetching || !this.props.course) {
      content = (
        <Card className="courses-card">
          <CardBody className="text-center">
            <FontAwesomeIcon icon={faSpinner} pulse />
          </CardBody>
        </Card>
      )
    } else {
      let queues
      if (this.props.course.queues && this.props.course.queues.length > 0) {
        queues = this.props.course.queues.map((id) => {
          const queue = this.props.queues[id]
          return (
            <Queue
              key={id}
              onDeleteQueue={queueId => this.deleteQueue(queueId)}
              isUserCourseStaff={this.props.isUserCourseStaff}
              {...queue}
            />
          )
        }, this)
      } else {
        queues = (
          <div>
            <ListGroupItem className="text-center text-muted pt-4 pb-4">
              There aren&apos;t any queues right now
            </ListGroupItem>
          </div>
        )
      }

      const createQueuePanel = (
        <NewQueue
          onCreateQueue={queue => this.createQueue(queue)}
          onCancel={() => this.hideCreateQueuePanel()}
        />
      )

      const createQueueButton = (
        <ShowForCourseStaff courseId={this.props.courseId}>
          <ListGroupItem action className="text-muted" onClick={() => this.showCreateQueuePanel()}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create a queue
          </ListGroupItem>
        </ShowForCourseStaff>
      )

      content = (
        <Card className="courses-card">
          <CardHeader className="bg-primary text-white d-flex align-items-center">
            <CardTitle tag="h4" className="mb-0">
              {this.props.course && this.props.course.name} Queues
            </CardTitle>
            <ShowForCourseStaff courseId={this.props.courseId}>
              <Link route="courseStaff" params={{ id: this.props.courseId }} prefetch passHref>
                <Button tag="a" color="light" size="sm" className="ml-auto">Manage Staff</Button>
              </Link>
            </ShowForCourseStaff>
          </CardHeader>
          <ListGroup flush>
            <FlipMove
              enterAnimation="accordionVertical"
              leaveAnimation="accordionVertical"
              duration={200}
            >
              {queues}
            </FlipMove>
            {!this.state.showCreateQueuePanel && createQueueButton}
            {this.state.showCreateQueuePanel && createQueuePanel}
          </ListGroup>
        </Card>
      )
    }

    return (
      <Layout>
        <Container fluid>
          {content}
        </Container>
        <style jsx>{`
          :global(.courses-card) {
            width: 100%;
            max-width: 500px;
            margin: auto;
          }
        `}</style>
      </Layout>
    )
  }
}

Course.propTypes = {
  courseId: PropTypes.number.isRequired,
  course: PropTypes.shape({
    name: PropTypes.string,
    queues: PropTypes.arrayOf(PropTypes.number),
  }),
  queues: PropTypes.objectOf(PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.location,
  })),
  isFetching: PropTypes.bool,
  createQueue: PropTypes.func.isRequired,
  fetchCourse: PropTypes.func.isRequired,
  deleteQueue: PropTypes.func.isRequired,
  isUserCourseStaff: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
}

Course.defaultProps = {
  course: null,
  queues: null,
  isFetching: true,
  isUserCourseStaff: false,
}

const mapStateToProps = (state, ownProps) => {
  const course = state.courses.courses[ownProps.courseId]
  return {
    course,
    queues: state.queues.queues,
    isFetching: state.courses.isFetching || state.queues.isFetching,
    isUserCourseStaff: isUserCourseStaff(state, ownProps),
  }
}

const mapDispatchToProps = dispatch => ({
  fetchCourse: courseId => dispatch(fetchCourse(courseId)),
  createQueue: (courseId, queue) => dispatch(createQueue(courseId, queue)),
  deleteQueue: (courseId, queueId) => dispatch(deleteQueue(courseId, queueId)),
  dispatch,
})

export default withRedux(makeStore, mapStateToProps, mapDispatchToProps)(PageWithUser(Course))
