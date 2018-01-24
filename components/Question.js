import React from 'react'
import PropTypes from 'prop-types'
import {
  ListGroupItem,
  Button,
  Badge,
} from 'reactstrap'
import Moment from 'react-moment'


const Question = (props) => {
  const {
    id,
    name,
    location,
    topic,
    beingAnswered,
    enqueueTime,
  } = props
  const badgeColor = beingAnswered ? 'success' : 'secondary'
  const badgeLabel = beingAnswered ? 'TA Answering' : 'Waiting'

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
      <div className="ml-auto">
        <Button color="primary" outline className="mr-2">Start Answering!</Button>
        <Button
          color="danger"
          outline
          onClick={() => props.onDeleteQuestion(id)}
        >
          Delete
        </Button>
      </div>
    </ListGroupItem>
  )
}

Question.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  beingAnswered: PropTypes.bool.isRequired,
  enqueueTime: PropTypes.string.isRequired,
  onDeleteQuestion: PropTypes.func.isRequired,
}

export default Question
