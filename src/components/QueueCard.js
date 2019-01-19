import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMapMarker,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons'

import ShowForCourseStaff from './ShowForCourseStaff'

const QueueCard = ({
  queue,
  courseName,
  open,
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
    <Card
      className={open ? 'queue-card' : 'closed-queue-card bg-light'}
      {...rest}
    >
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
          <FontAwesomeIcon
            icon={faQuestionCircle}
            fixedWidth
            className="mr-2"
          />
          {questionCountText}
        </div>
      </CardBody>
      <style global jsx>{`
        .queue-card,
        .closed-queue-card {
          transition: all 200ms;
          cursor: pointer;
        }
        .queue-card:hover {
          transform: translateY(-1px);
          box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
            0px 2px 2px 0px rgba(0, 0, 0, 0.14),
            0px 3px 1px -2px rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </Card>
  )
}

QueueCard.defaultProps = {
  courseName: null,
  open: PropTypes.bool,
}

QueueCard.propTypes = {
  queue: PropTypes.shape({
    courseId: PropTypes.number,
  }).isRequired,
  courseName: PropTypes.string,
  open: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default QueueCard
