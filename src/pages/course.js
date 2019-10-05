import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Row, Card, CardBody, Button } from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUsers, faDownload } from '@fortawesome/free-solid-svg-icons'

import axios from '../actions/axios'
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

  const getFlattenedData = resData => {
    let data = []
    let columns = new Set()

    resData.forEach(question => {
      let flattenedQuestion = {}
      Object.keys(question).forEach(questionKey => {
        if (
          questionKey === 'queue' ||
          questionKey === 'askedBy' ||
          questionKey === 'answeredBy'
        ) {
          const nestedObject = question[questionKey]
          if (nestedObject != null) {
            Object.keys(nestedObject).forEach(queueKey => {
              if (queueKey === 'course') {
                Object.keys(question[questionKey][queueKey]).forEach(
                  courseKey => {
                    columns.add(courseKey)
                    flattenedQuestion[courseKey] =
                      question[questionKey][queueKey][courseKey]
                  }
                )
              } else {
                columns.add(queueKey)
                flattenedQuestion[queueKey] = question[questionKey][queueKey]
              }
            })
          }
        } else {
          columns.add(questionKey)
          flattenedQuestion[questionKey] = question[questionKey]
        }
      })
      data.push(flattenedQuestion)
    })

    return [data, columns]
  }

  const handleFetchQueueData = () => {
    axios.get(`/api/courses/${props.courseId}/data`).then(
      res => {
        console.log(res.data)
        const [data, columns] = getFlattenedData(res.data)

        // Taken from https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
        const header = Array.from(columns)
        const replacer = (key, value) => (value === null ? '' : value)
        let csv = data.map(row =>
          header
            .map(fieldName => JSON.stringify(row[fieldName], replacer))
            .join(',')
        )
        csv.unshift(header.join(','))
        csv = csv.join('\r\n')

        // Taken from https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react
        const element = document.createElement('a')
        const csvFile = new Blob([csv], { type: 'text/csv' })
        element.href = URL.createObjectURL(csvFile)
        element.download = 'queueData.csv'
        document.body.appendChild(element) // Required for this to work in FireFox
        element.click()
      },
      err => {
        console.error(err)
      }
    )
  }

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
            <Button
              color="primary"
              className="mr-3 mt-3"
              onClick={() => handleFetchQueueData()}
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Download Queue Data
            </Button>
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
