import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMapMarker,
  faQuestionCircle,
  faEyeSlash,
  faCog,
  faStar as fasStar,
} from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

import {
  addStarredByUser as addStarredByUserAction,
  removeStarredByUser as removeStarredByUserAction,
} from '../actions/user'
import { Link } from '../routes'
import ShowForCourseStaff from './ShowForCourseStaff'

const QueueCard = ({
  queue,
  courseName,
  open,
  addStarredByUser,
  removeStarredByUser,
  isStarred,
  userId,
  ...rest
}) => {
  const { name: queueName, location, questionCount, isConfidential } = queue

  const questionCountText = `${questionCount} Question${
    questionCount !== 1 ? 's' : ''
  }`
  const locationText = location || 'No location specified'

  const title = courseName || queueName
  const showQueueNameInBody = !!courseName

  const handleStar = e => {
    e.stopPropagation()
    if (isStarred) {
      removeStarredByUser(queue)
    } else {
      addStarredByUser(queue)
    }
  }

  return (
    <Card
      className={open ? 'queue-card' : 'closed-queue-card bg-light'}
      {...rest}
    >
      <CardBody>
        <CardTitle className="d-flex">
          <span className="h5 mb-2 mr-auto pr-3">
            {isConfidential && !showQueueNameInBody && (
              <FontAwesomeIcon icon={faEyeSlash} fixedWidth className="mr-2" />
            )}
            {title}
            <Button
              className="pb-2 pl-2 pr-0 pt-0"
              color="link"
              size="lg"
              onClick={e => handleStar(e)}
            >
              <FontAwesomeIcon
                icon={isStarred ? fasStar : farStar}
                fixedWidth
              />
            </Button>
          </span>
          <div>
            <ShowForCourseStaff courseId={queue.courseId}>
              <Link passHref route="queueSettings" params={{ id: queue.id }}>
                {/* eslint-disable-next-line */}
                <a className="p-1" onClick={e => e.stopPropagation()}>
                  <span className="sr-only">Queue settings</span>
                  <FontAwesomeIcon icon={faCog} size="lg" />
                </a>
              </Link>
            </ShowForCourseStaff>
          </div>
        </CardTitle>
        {showQueueNameInBody && (
          <CardSubtitle className="mb-2">
            {isConfidential && (
              <FontAwesomeIcon icon={faEyeSlash} fixedWidth className="mr-2" />
            )}
            {queueName}
          </CardSubtitle>
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
          transition: transform 200ms, box-shadow 200ms;
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
  isStarred: false,
  open: PropTypes.bool,
}

QueueCard.propTypes = {
  queue: PropTypes.shape({
    courseId: PropTypes.number,
  }).isRequired,
  courseName: PropTypes.string,
  open: PropTypes.bool,
  addStarredByUser: PropTypes.func.isRequired,
  removeStarredByUser: PropTypes.func.isRequired,
  isStarred: PropTypes.bool,
}

const mapDispatchToProps = dispatch => ({
  addStarredByUser: queue => dispatch(addStarredByUserAction(queue)),
  removeStarredByUser: queue => dispatch(removeStarredByUserAction(queue)),
})

export default connect(
  null,
  mapDispatchToProps
)(QueueCard)
