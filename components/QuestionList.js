import React from 'react'
import PropTypes from 'prop-types'
import {
  ListGroup,
  ListGroupItem,
  Button,
  Badge,
} from 'reactstrap'
import { connect } from 'react-redux'
import Moment from 'react-moment'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'


const QuestionList = (props) => {
  let questions
  if (props.queue && props.queue.questions) {
    if (props.queue.questions.length > 0) {
      questions = props.queue.questions.map((questionId) => {
        const question = props.questions[questionId]
        const {
          id,
          name,
          location,
          topic,
          beingAnswered,
          enqueueTime,
        } = question
        const badgeColor = beingAnswered ? 'success' : 'secondary'
        const badgeLabel = beingAnswered ? 'TA Answering' : 'Waiting'

        return (
          <ListGroupItem key={id} className="d-md-flex align-items-center">
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
              <Button color="danger" outline onClick={() => props.deleteQuestion(id)}>Delete</Button>
            </div>
          </ListGroupItem>
        )
      })
    } else {
      questions = (
        <ListGroupItem className="text-center text-muted pt-4 pb-4">
          The queue is empty!
        </ListGroupItem>
      )
    }
  } else {
    questions = (
      <ListGroupItem className="text-center pt-4 pb-4">
        <FontAwesomeIcon icon={faSpinner} pulse />
      </ListGroupItem>
    )
  }

  return (
    <div>
      <ListGroup className="mt-3">
        {questions}
      </ListGroup>
    </div>
  )
}

QuestionList.propTypes = {
  queue: PropTypes.shape({
    questions: PropTypes.arrayOf(PropTypes.number),
  }),
  questions: PropTypes.objectOf(PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
    topic: PropTypes.string,
  })),
}

QuestionList.defaultProps = {
  queue: null,
  questions: null,
}

const mapStateToProps = (state, { queueId }) => ({
  queue: state.queues.queues[queueId],
  questions: state.questions.questions,
})

export default connect(mapStateToProps)(QuestionList)
