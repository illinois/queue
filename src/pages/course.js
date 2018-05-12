import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Row, Card, CardBody, Button } from 'reactstrap'
import Error from 'next/error'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faUsers from '@fortawesome/fontawesome-free-solid/faUsers'

import { Link } from '../routes'
import { fetchCourseRequest, fetchCourse } from '../actions/course'
import { createQueue, deleteQueue, updateQueue } from '../actions/queue'

import PageWithUser from '../components/PageWithUser'
import NewQueue from '../components/NewQueue'
import QueueCardListContainer from '../containers/QueueCardListContainer'
import ShowForCourseStaff from '../components/ShowForCourseStaff'
import ConfirmDeleteQueueModal from '../components/ConfirmDeleteQueueModal'
import CourseShortCodeInfo from '../components/CourseShortCodeInfo'

class Course extends React.Component {
  static async getInitialProps({ isServer, store, query }) {
    const courseId = Number.parseInt(query.id, 10)
    if (isServer) {
      store.dispatch(fetchCourseRequest(courseId))
    }
    return {
      courseId,
      isFetching: isServer,
    }
  }

  static shouldDelayEnter = true

  constructor(props) {
    super(props)

    this.state = {
      showCreateQueuePanel: false,
    }
  }

  componentDidMount() {
    this.props.fetchCourse(this.props.courseId).then(() => {
      if (this.props.onLoaded) {
        this.props.onLoaded()
      }
    })
  }

  showCreateQueuePanel(state) {
    this.setState({
      showCreateQueuePanel: state,
    })
  }

  createQueue(queue) {
    this.props
      .createQueue(this.props.courseId, queue)
      .then(() => this.showCreateQueuePanel(false))
  }

  render() {
    if (this.props.isFetching) {
      return null
    }
    if (!this.props.isFetching && !this.props.course) {
      return <Error statusCode={404} />
    }

    return (
      <Fragment>
        <Container>
          <div className="d-flex flex-wrap align-items-center mb-4">
            <h1 className="display-4 d-inline-block mb-0 mt-3 mr-auto pr-3">
              {this.props.course.name}
            </h1>
            <ShowForCourseStaff courseId={this.props.courseId}>
              <Link
                route="courseStaff"
                params={{ id: this.props.courseId }}
                prefetch
                passHref
              >
                <Button tag="a" color="primary" className="mt-3">
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  Manage staff
                </Button>
              </Link>
            </ShowForCourseStaff>
          </div>
          <div className="d-flex flex-wrap align-items-center mb-4">
            <h2 className="d-inline-block mb-0 mt-3 mr-auto pr-3">Queues</h2>
            <ShowForCourseStaff courseId={this.props.courseId}>
              <Button
                color="primary"
                className="mt-3"
                onClick={() => this.showCreateQueuePanel(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Create queue
              </Button>
            </ShowForCourseStaff>
          </div>
          {this.state.showCreateQueuePanel && (
            <Card className="mb-4">
              <CardBody>
                <NewQueue
                  showCourseSelector={false}
                  onCreateQueue={(queue, courseId) =>
                    this.createQueue(queue, courseId)
                  }
                  onCancel={() => this.showCreateQueuePanel(false)}
                />
              </CardBody>
            </Card>
          )}
          <Row className="equal-height mb-5">
            <QueueCardListContainer queueIds={this.props.course.queues} />
          </Row>
          <CourseShortCodeInfo course={this.props.course} />
        </Container>
        {this.state.showDeleteQueueModal && (
          <ConfirmDeleteQueueModal
            isOpen={this.state.showDeleteQueueModal}
            toggle={() => this.toggleDeleteModal()}
            confirm={() => this.confirmDeleteQueue()}
          />
        )}
        <style jsx>{`
          :global(.courses-card) {
            width: 100%;
            max-width: 500px;
            margin: auto;
          }
        `}</style>
      </Fragment>
    )
  }
}

Course.propTypes = {
  courseId: PropTypes.number.isRequired,
  course: PropTypes.shape({
    name: PropTypes.string,
    queues: PropTypes.arrayOf(PropTypes.number),
  }),
  queues: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string,
      location: PropTypes.location,
    })
  ),
  isFetching: PropTypes.bool,
  createQueue: PropTypes.func.isRequired,
  fetchCourse: PropTypes.func.isRequired,
  onLoaded: PropTypes.func,
}

Course.defaultProps = {
  course: null,
  queues: null,
  isFetching: true,
  onLoaded: false,
}

const mapStateToProps = (state, ownProps) => {
  const course = state.courses.courses[ownProps.courseId]
  return {
    course,
    queues: state.queues.queues,
    isFetching: state.courses.isFetching || state.queues.isFetching,
  }
}

const mapDispatchToProps = dispatch => ({
  fetchCourse: courseId => dispatch(fetchCourse(courseId)),
  createQueue: (courseId, queue) => dispatch(createQueue(courseId, queue)),
  updateQueue: (queueId, attributes) =>
    dispatch(updateQueue(queueId, attributes)),
  deleteQueue: (courseId, queueId) => dispatch(deleteQueue(courseId, queueId)),
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(
  PageWithUser(Course)
)
