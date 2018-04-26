import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faMapMarker from '@fortawesome/fontawesome-free-solid/faMapMarker'
import faQuestion from '@fortawesome/fontawesome-free-solid/faQuestionCircle'

import ShowForCourseStaff from './ShowForCourseStaff'

const ClosedQueueCard = ({
  queue,
  courseName,
  openQueue,
  onDelete,
  onUpdate,
  ...rest
}) => {
  const { name: queueName, location, questionCount } = queue

  const questionCountText = `${questionCount} Question${
    questionCount !== 1 ? 's' : ''
  }`
  const locationText = location || 'No location specified'

  const handleDelete = e => {
    e.stopPropagation()
    e.preventDefault()
    onDelete()
  }

  const handleUpdate = e => {
    e.stopPropagation()
    e.preventDefault()
    onUpdate()
  }

  const title = courseName || queueName
  const showQueueNameInBody = !!courseName
  return (
    <Card className="closed-queue-card bg-light" {...rest}>
      <CardBody>
        <CardTitle className="d-flex flex-wrap align-items-center">
          <span className="mb-2 mr-auto pr-3">{title}</span>
          <div>
            <ShowForCourseStaff courseId={queue.courseId}>
              <Button color="danger" size="sm" outline onClick={handleDelete}>
                Delete
              </Button>
            </ShowForCourseStaff>
            <ShowForCourseStaff courseId={queue.courseId}>
              <Button
                color="primary"
                size="sm"
                className="mr-0 ml-1"
                outline
                onClick={handleUpdate}
              >
                Edit
              </Button>
            </ShowForCourseStaff>
          </div>
        </CardTitle>
        {showQueueNameInBody && (
          <CardSubtitle className="mb-2">{queueName}</CardSubtitle>
        )}
        <div className="text-muted">
          <FontAwesomeIcon icon={faMapMarker} fixedWidth className="mr-2" />
          {locationText}
          <br />
          <FontAwesomeIcon icon={faQuestion} fixedWidth className="mr-2" />
          {questionCountText}
        </div>
      </CardBody>
      <style global jsx>{`
        .closed-queue-card {
          transition: all 200ms;
          cursor: pointer;
        }
      `}</style>
    </Card>
  )
}

ClosedQueueCard.defaultProps = {
  courseName: null,
}

ClosedQueueCard.propTypes = {
  queue: PropTypes.shape({
    courseId: PropTypes.number,
  }).isRequired,
  courseName: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default ClosedQueueCard
