import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  ListGroupItem,
  Button,
  Badge,
} from 'reactstrap'
import Moment from 'react-moment'

/* eslint-disable react/prefer-stateless-function */
class Question extends React.Component {
  render() {
    const {
      id,
      name,
      location,
      topic,
      beingAnswered,
      enqueueTime,
      isUserCourseStaff,
      didUserAskQuestion,
    } = this.props
    const badgeColor = beingAnswered ? 'success' : 'secondary'
    const badgeLabel = beingAnswered ? 'TA Answering' : 'Waiting'

    const userCanDelete = didUserAskQuestion || isUserCourseStaff

    let buttonCluster
    if (beingAnswered) {
      if (isUserCourseStaff) {
        buttonCluster = (
          <Fragment>
            <Button
              color="primary"
              className="mr-2"
              onClick={() => this.props.onFinishedAnswering(id)}
            >
              Finish Answering
            </Button>
            <Button
              color="light"
              onClick={() => this.props.onUpdateQuestionBeingAnswered(id, false)}
            >
              Cancel
            </Button>
          </Fragment>
        )
      } else {
        buttonCluster = userCanDelete ? (
          <Button
            color="danger"
            outline
            onClick={() => this.props.onDeleteQuestion(id)}
          >
            Delete
          </Button>
        ) : null
      }
    } else {
      buttonCluster = (
        <Fragment>
          {isUserCourseStaff &&
            <Button
              color="primary"
              outline
              className="mr-2"
              onClick={() => this.props.onUpdateQuestionBeingAnswered(id, true)}
            >
              Start Answering!
            </Button>
          }
          {userCanDelete &&
            <Button
              color="danger"
              outline
              onClick={() => this.props.onDeleteQuestion(id)}
            >
              Delete
            </Button>
          }
        </Fragment>
      )
    }

    return (
      <ListGroupItem key={id} className="d-sm-flex align-items-center">
        <div>
          <div>
            <Badge color={badgeColor} className="mr-2">{badgeLabel}</Badge>
            <strong>{name}</strong>
          </div>
          <div className="text-muted">
            <span className="text-muted">
              <Moment fromNow>{enqueueTime}</Moment>
              <span className="mr-2 ml-2">&bull;</span>
              {location}
            </span>
          </div>
          <div>
            {topic}
          </div>
        </div>
        <div className="ml-auto pt-3 pt-sm-0">
          {buttonCluster}
        </div>
      </ListGroupItem>
    )
  }
}

Question.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  beingAnswered: PropTypes.bool.isRequired,
  enqueueTime: PropTypes.string.isRequired,
  didUserAskQuestion: PropTypes.bool.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
  onUpdateQuestionBeingAnswered: PropTypes.func.isRequired,
  onFinishedAnswering: PropTypes.func.isRequired,
  onDeleteQuestion: PropTypes.func.isRequired,
}

export default Question
