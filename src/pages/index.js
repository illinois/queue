import React from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Card, CardBody, Button } from 'reactstrap'
import withRedux from 'next-redux-wrapper'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'

import { Link } from '../routes'
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
import { mapObjectToArray } from '../util'

import PageWithUser from '../components/PageWithUser'
import Loading from '../components/Loading'
import Layout from '../components/Layout'
import NewCourse from '../components/NewCourse'
import NewQueue from '../components/NewQueue'
import ShowForAdmin from '../components/ShowForAdmin'
import QueueCardListContainer from '../containers/QueueCardListContainer'
import DevWorkshopAd from '../components/DevWorkshopAd'

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

    const openQueueIds = this.props.queues
      .filter(queue => queue.open)
      .map(queue => queue.id)
    const closedQueueIds = this.props.queues
      .filter(queue => !queue.open)
      .map(queue => queue.id)

    return (
      <Layout>
        <Container>
          <DevWorkshopAd />
          <div className="d-flex flex-wrap align-items-center mb-4">
            <h1 className="display-4 d-inline-block mb-0 mt-3 mr-auto pr-3">
              Open queues
            </h1>
            {this.props.showCreateQueueButton && (
              <Button
                color="primary"
                className="mt-3"
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
          <Row className="equal-height mb-4">
            <QueueCardListContainer
              queueIds={openQueueIds}
              showCourseName
              openQueue
            />
          </Row>
          <div className="d-flex flex-wrap align-items-center mb-4">
            <h3 className="d-inline-block mb-0 mt-3 mr-auto pr-3">
              Or, select a course
            </h3>
            <ShowForAdmin>
              <Button
                color="primary"
                className="mt-3"
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
          <div className="d-flex flex-wrap align-items-center mb-4">
            <h1 className="display-4 d-inline-block mb-0 mt-3 mr-auto pr-3">
              Closed queues
            </h1>
          </div>
          <Row className="equal-height mb-4">
            <QueueCardListContainer
              queueIds={closedQueueIds}
              showCourseName
              openQueue={false}
            />
          </Row>
        </Container>
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
  queues: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ),
  fetchCourses: PropTypes.func.isRequired,
  fetchQueues: PropTypes.func.isRequired,
  createCourse: PropTypes.func.isRequired,
  createQueue: PropTypes.func.isRequired,
}

Index.defaultProps = {
  courses: [],
  queues: [],
}

const mapStateToProps = state => ({
  showCreateQueueButton:
    state.user.user &&
    (state.user.user.isAdmin || state.user.user.staffAssignments.length > 0),
  courses: mapObjectToArray(state.courses.courses),
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
