import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Row, Card, CardBody, Button } from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUsers } from '@fortawesome/free-solid-svg-icons'

import { Link } from '../routes'
import { fetchCourseRequest, fetchCourse } from '../actions/course'
import { createQueue } from '../actions/queue'
import { mapObjectToArray } from '../util'

import Error from '../components/Error'
import PageWithUser from '../components/PageWithUser'
import NewQueue from '../components/NewQueue'
import QueueCardListContainer from '../containers/QueueCardListContainer'
import ShowForCourseStaff from '../components/ShowForCourseStaff'
import CourseShortCodeInfo from '../components/CourseShortCodeInfo'

const Course = props => {
  const [courseLoading, setCourseLoading] = useState(true)
  const [showCreateQueuePanel, setShowCreateQueuePanel] = useState(false)

  useEffect(() => {
    setCourseLoading(true)
    props.fetchCourse(props.courseId).then(() => {
      setCourseLoading(false)
      if (props.pageTransitionReadyToEnter) {
        props.pageTransitionReadyToEnter()
      }
    })
  }, [props.courseId])

  if (courseLoading) {
    return null
  }

  if (!courseLoading && !props.course) {
    return <Error statusCode={404} />
  }

  const openQueueIds = props.queues
    .filter(queue => queue.open)
    .filter(queue => queue.courseId === props.courseId)
    .map(queue => queue.id)
  const closedQueueIds = props.queues
    .filter(queue => !queue.open)
    .filter(queue => queue.courseId === props.courseId)
    .map(queue => queue.id)

  return (
    <Fragment>
      <Container>
        <div className="d-flex flex-wrap align-items-center mb-4">
          <h1 className="display-4 d-inline-block mb-0 mt-3 mr-auto pr-3">
            {props.course.name}
          </h1>
          <ShowForCourseStaff courseId={props.courseId}>
            <Link
              route="courseStaff"
              params={{ id: props.courseId }}
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
          <h2 className="d-inline-block mb-0 mt-3 mr-auto pr-3">Open Queues</h2>
          {!showCreateQueuePanel && (
            <ShowForCourseStaff courseId={props.courseId}>
              <Button
                color="primary"
                className="mt-3"
                onClick={() => setShowCreateQueuePanel(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Create queue
              </Button>
            </ShowForCourseStaff>
          )}
        </div>
        {showCreateQueuePanel && (
          <Card className="mb-4">
            <CardBody>
              <NewQueue
                showCourseSelector={false}
                onCreateQueue={queue =>
                  // courseId passed through callback won't be valid since
                  // the user isn't explicitly setting a course
                  props.createQueue(props.courseId, queue).then(() => {
                    setShowCreateQueuePanel(false)
                  })
                }
                onCancel={() => setShowCreateQueuePanel(false)}
              />
            </CardBody>
          </Card>
        )}
        <Row className="equal-height mb-5">
          <QueueCardListContainer queueIds={openQueueIds} openQueue />
        </Row>
        <div className="d-flex flex-wrap align-items-center mb-4">
          <h2 className="d-inline-block mb-0 mt-3 mr-auto pr-3">
            Closed Queues
          </h2>
        </div>
        <Row className="equal-height mb-5">
          <QueueCardListContainer queueIds={closedQueueIds} openQueue={false} />
        </Row>
        <CourseShortCodeInfo course={props.course} />
      </Container>
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

Course.getInitialProps = async ({ isServer, store, query }) => {
  const courseId = Number.parseInt(query.id, 10)
  if (isServer) {
    store.dispatch(fetchCourseRequest(courseId))
  }
  return { courseId }
}

Course.propTypes = {
  courseId: PropTypes.number.isRequired,
  course: PropTypes.shape({
    name: PropTypes.string,
    queues: PropTypes.arrayOf(PropTypes.number),
  }),
  queues: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      location: PropTypes.location,
      open: PropTypes.boolean,
      courseId: PropTypes.number,
    })
  ),
  createQueue: PropTypes.func.isRequired,
  fetchCourse: PropTypes.func.isRequired,
  pageTransitionReadyToEnter: PropTypes.func,
}

Course.pageTransitionDelayEnter = true

Course.defaultProps = {
  course: null,
  queues: [],
  pageTransitionReadyToEnter: false,
}

const mapStateToProps = (state, ownProps) => {
  const course = state.courses.courses[ownProps.courseId]
  return {
    course,
    queues: mapObjectToArray(state.queues.queues),
  }
}

const mapDispatchToProps = dispatch => ({
  fetchCourse: courseId => dispatch(fetchCourse(courseId)),
  createQueue: (courseId, queue) => dispatch(createQueue(courseId, queue)),
  dispatch,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWithUser(Course))
