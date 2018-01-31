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
    } = this.props
    const badgeColor = beingAnswered ? 'success' : 'secondary'
    const badgeLabel = beingAnswered ? 'TA Answering' : 'Waiting'

    let buttonCluster
    if (beingAnswered) {
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
      buttonCluster = (
        <Fragment>
          <Button
            color="primary"
            outline
            className="mr-2"
            onClick={() => this.props.onUpdateQuestionBeingAnswered(id, true)}
          >
            Start Answering!
          </Button>
          <Button
            color="danger"
            outline
            onClick={() => this.props.onDeleteQuestion(id)}
          >
            Delete
          </Button>
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
  onUpdateQuestionBeingAnswered: PropTypes.func.isRequired,
  onFinishedAnswering: PropTypes.func.isRequired,
  onDeleteQuestion: PropTypes.func.isRequired,
}

export default Question
