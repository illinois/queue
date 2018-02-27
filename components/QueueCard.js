import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
} from 'reactstrap'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faMapMarker from '@fortawesome/fontawesome-free-solid/faMapMarker'
import faQuestion from '@fortawesome/fontawesome-free-solid/faQuestionCircle'

import ShowForCourseStaff from './ShowForCourseStaff'

const QueueCard = ({
  queue,
  courseName,
  onDelete,
  ...rest
}) => {
  const { name: queueName, location, questionCount } = queue

  const questionCountText = `${questionCount} Question${questionCount !== 1 ? 's' : ''}`
  const locationText = location || 'No location specified'

  const handleDelete = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onDelete()
  }

  return (
    <Card className="queue-card" {...rest}>
      <CardBody>
        <CardTitle className="d-flex align-items-center">
          {courseName}
          <ShowForCourseStaff courseId={queue.courseId}>
            <Button
              color="danger"
              size="sm"
              className="ml-auto"
              outline
              onClick={handleDelete}
            >
              Delete
            </Button>
          </ShowForCourseStaff>
        </CardTitle>
        <CardSubtitle className="mb-2">{queueName}</CardSubtitle>
        <div className="text-muted">
          <FontAwesomeIcon icon={faMapMarker} fixedWidth className="mr-2" />
          {locationText}
          <br />
          <FontAwesomeIcon icon={faQuestion} fixedWidth className="mr-2" />
          {questionCountText}
        </div>
      </CardBody>
      <style global jsx>{`
        .queue-card {
          transition: all 200ms;
          cursor: pointer;
        }
        .queue-card:hover {
          transform: translateY(-1px);
          box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </Card>
  )
}

QueueCard.propTypes = {
  queue: PropTypes.shape({
    courseId: PropTypes.number,
  }).isRequired,
  courseName: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default QueueCard
