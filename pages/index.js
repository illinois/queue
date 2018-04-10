import React from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap'
import withRedux from 'next-redux-wrapper'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'

import { Link, Router } from '../routes'
import makeStore from '../redux/makeStore'
import {
  fetchCoursesRequest,
  fetchCourses,
  createCourse,
} from '../actions/course'
import {
  fetchQueues,
  createQueue,
  deleteQueue,
  updateQueue,
} from '../actions/queue'

import PageWithUser from '../components/PageWithUser'
import Loading from '../components/Loading'
import Layout from '../components/Layout'
import NewCourse from '../components/NewCourse'
import NewQueue from '../components/NewQueue'
import ShowForAdmin from '../components/ShowForAdmin'
import QueueCard from '../components/QueueCard'
import QueueEdit from '../components/QueueEdit'
import ConfirmDeleteQueueModal from '../components/ConfirmDeleteQueueModal'

class Index extends React.Component {
  static async getInitialProps({ store, isServer }) {
    if (isServer) {
      // We're going to start loading as soon as we're on the client
      store.dispatch(fetchCoursesRequest())
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      finishedLoading: false,
      showCreateCoursePanel: false,
      showCreateQueuePanel: false,
      showDeleteQueueModal: false,
      showEditQueueModal: false,
      pendingDeleteQueue: null,
      pendingEditQueueId: null,
    }
  }

  componentDidMount() {
    // We need to wait for multiple network requests to complete, so we can't
    // use the usual isFetching property from the state blob
    Promise.all([this.props.fetchCourses(), this.props.fetchQueues()]).then(
      () => {
        this.setState({
          finishedLoading: true,
        })
      }
    )
  }

  showCreateCoursePanel(state) {
    this.setState({
      showCreateCoursePanel: state,
    })
  }

  showCreateQueuePanel(state) {
    this.setState({
      showCreateQueuePanel: state,
    })
  }

  createCourse(course) {
    this.props
      .createCourse(course)
      .then(() => this.showCreateCoursePanel(false))
  }

  createQueue(queue, courseId) {
    this.props
      .createQueue(courseId, queue)
      .then(() => this.showCreateQueuePanel(false))
  }

  editQueue(queueId) {
    this.setState({
      showEditQueueModal: true,
      pendingEditQueueId: queueId,
    })
  }

  submitQueueEdit(attributes) {
    const { pendingEditQueueId } = this.state
    this.props.updateQueue(pendingEditQueueId, attributes).then(() => {
      this.setState({
        showEditQueueModal: false,
        pendingEditQueueId: null,
      })
    })
  }

  queueEditCancel() {
    this.setState({
      showEditQueueModal: false,
      pendingEditQueueId: null,
    })
  }

  deleteQueue(courseId, queueId) {
    this.setState({
      showDeleteQueueModal: true,
      pendingDeleteQueue: { courseId, queueId },
    })
  }

  confirmDeleteQueue() {
    const { courseId, queueId } = this.state.pendingDeleteQueue
    this.props.deleteQueue(courseId, queueId).then(() => {
      this.setState({
        showDeleteQueueModal: false,
        pendingDeleteQueue: null,
      })
    })
  }

  toggleDeleteModal() {
    this.setState({
      showDeleteQueueModal: !this.state.showDeleteQueueModal,
    })
  }

  render() {
    if (!this.state.finishedLoading) {
      return <Loading />
    }

    let courseButtons
    if (this.props.courses && this.props.courses.length > 0) {
      courseButtons = this.props.courses.map(course => (
        <Link
          route="course"
          params={{ id: course.id }}
          key={course.id}
          prefetch
          passHref
        >
          <Button color="primary" tag="a" className="mr-3 mb-3" outline>
            {course.name}
          </Button>
        </Link>
      ))
    }

    const CardCol = ({ children, ...rest }) => (
      <Col
        xs={{ size: 12 }}
        md={{ size: 6 }}
        lg={{ size: 4 }}
        className="mb-3"
        {...rest}
      >
        {children}
      </Col>
    )

    let queues
    if (this.props.queues && this.props.queues.length > 0) {
      const handleQueueClick = id => {
        Router.pushRoute('queue', { id })
      }
      queues = this.props.queues.map(queue => {
        const courseName = this.props.coursesById[queue.courseId].name
        return (
          <CardCol key={queue.id}>
            <QueueCard
              queue={queue}
              courseName={courseName}
              onClick={() => handleQueueClick(queue.id)}
              onDelete={() => this.deleteQueue(queue.courseId, queue.id)}
              onUpdate={() => this.editQueue(queue.id)}
            />
          </CardCol>
        )
      })
    } else {
      queues = (
        <Col>
          <Card className="bg-light">
            <CardBody className="text-center">
              There aren&apos;t any open queues right now
            </CardBody>
          </Card>
        </Col>
      )
    }

    return (
      <Layout>
        <Container>
          <div className="d-sm-flex align-items-center mb-4">
            <h1 className="display-4 d-block d-sm-inline-block">Open queues</h1>
            {this.props.showCreateQueueButton && (
              <Button
                color="primary"
                className="ml-auto mt-3 mt-sm-0"
                onClick={() => this.showCreateQueuePanel(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Create queue
              </Button>
            )}
          </div>
          {this.state.showCreateQueuePanel && (
            <Card className="mb-4">
              <CardBody>
                <NewQueue
                  showCourseSelector
                  onCreateQueue={(queue, courseId) =>
                    this.createQueue(queue, courseId)
                  }
                  onCancel={() => this.showCreateQueuePanel(false)}
                />
              </CardBody>
            </Card>
          )}
          <Row className="equal-height mb-5">
            {queues}
            <QueueEdit
              queue={this.props.queuesById[this.state.pendingEditQueueId]}
              isOpen={this.state.showEditQueueModal}
              onSubmitQueueEdit={attributes => this.submitQueueEdit(attributes)}
              onCancel={() => this.queueEditCancel()}
            />
          </Row>
          <div className="d-sm-flex align-items-center mb-4">
            <h3 className="d-block d-sm-inline-block mb-0">
              Or, select a course
            </h3>
            <ShowForAdmin>
              <Button
                className="ml-auto mt-3 mt-sm-0"
                color="primary"
                onClick={() => this.showCreateCoursePanel(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Create course
              </Button>
            </ShowForAdmin>
          </div>
          {this.state.showCreateCoursePanel && (
            <Card className="mb-4">
              <CardBody>
                <NewCourse
                  onCreateCourse={course => this.createCourse(course)}
                  onCancel={() => this.showCreateCoursePanel(false)}
                />
              </CardBody>
            </Card>
          )}
          <div className="mb-1">{courseButtons}</div>
        </Container>
        {this.state.showDeleteQueueModal && (
          <ConfirmDeleteQueueModal
            isOpen={this.state.showDeleteQueueModal}
            toggle={() => this.toggleDeleteModal()}
            confirm={() => this.confirmDeleteQueue()}
          />
        )}
        <style global jsx>{`
          .courses-card {
            width: 100%;
            max-width: 500px;
            margin: auto;
          }
          .row.equal-height {
            display: flex;
            flex-wrap: wrap;
          }
          .row.equal-height > [class*='col-'] {
            display: flex;
            flex-direction: column;
          }
          .row.equal-height .card {
            flex: 1;
          }
        `}</style>
      </Layout>
    )
  }
}

Index.propTypes = {
  showCreateQueueButton: PropTypes.bool.isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ),
  coursesById: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ),
  queues: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ),
  queuesById: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ),
  fetchCourses: PropTypes.func.isRequired,
  fetchQueues: PropTypes.func.isRequired,
  createCourse: PropTypes.func.isRequired,
  createQueue: PropTypes.func.isRequired,
  updateQueue: PropTypes.func.isRequired,
  deleteQueue: PropTypes.func.isRequired,
}

Index.defaultProps = {
  courses: [],
  coursesById: {},
  queues: [],
  queuesById: {},
}

const mapObjectToArray = o => {
  const keys = Object.keys(o).map(id => Number.parseInt(id, 10))
  const sortKeys = keys.sort((a, b) => (a < b ? -1 : 1))
  return sortKeys.map(id => o[id])
}

const mapStateToProps = state => ({
  showCreateQueueButton:
    state.user.user &&
    (state.user.user.isAdmin || state.user.user.staffAssignments.length > 0),
  coursesById: state.courses.courses,
  courses: mapObjectToArray(state.courses.courses),
  queuesById: state.queues.queues,
  queues: mapObjectToArray(state.queues.queues),
})

const mapDispatchToProps = dispatch => ({
  fetchCourses: () => dispatch(fetchCourses()),
  fetchQueues: () => dispatch(fetchQueues()),
  createCourse: course => dispatch(createCourse(course)),
  createQueue: (courseId, queue) => dispatch(createQueue(courseId, queue)),
  updateQueue: (queueId, attributes) =>
    dispatch(updateQueue(queueId, attributes)),
  deleteQueue: (courseId, queueId) => dispatch(deleteQueue(courseId, queueId)),
})

export default withRedux(makeStore, mapStateToProps, mapDispatchToProps)(
  PageWithUser(Index)
)
