import React from 'react'
import PropTypes from 'prop-types'
import { ListGroupItem } from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const ConfidentialQueuePanel = props => {
  const questionId = props.getUserActiveQuestionIdForQueue
  let position = -1
  if (props.queue && props.queue.questions) {
    props.queue.questions.some(qId => {
      position += 1
      return qId === questionId
    })

    const numQuestions = props.queue.questions.length
    if (numQuestions === 0) {
      return null
    }
    const cardTotalQuestionsMessage =
      numQuestions === 1
        ? 'There is 1 person on the queue'
        : `There are ${numQuestions} people on the queue`
    const singularOrPluralPerson = position === 1 ? 'person' : 'people'
    const cardMessage =
      questionId === -1
        ? `${cardTotalQuestionsMessage}.`
        : `${cardTotalQuestionsMessage} with ${position} ${singularOrPluralPerson} in front of you.`

    return (
      <div>
        <ListGroupItem className="text-center text-muted pt-4 pb-4 mb-3">
          {cardMessage}
        </ListGroupItem>
      </div>
    )
  }
  return (
    <div>
      <ListGroupItem className="text-center pt-4 pb-4">
        <FontAwesomeIcon icon={faSpinner} pulse />
      </ListGroupItem>
    </div>
  )
}

ConfidentialQueuePanel.propTypes = {
  queue: PropTypes.shape({
    questions: PropTypes.arrayOf(PropTypes.number),
    fixedLocation: PropTypes.bool,
    isConfidential: PropTypes.bool,
  }),
  questions: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string,
      location: PropTypes.string,
      topic: PropTypes.string,
    })
  ),
  getUserActiveQuestionIdForQueue: PropTypes.number,
}

ConfidentialQueuePanel.defaultProps = {
  queue: null,
  questions: null,
  getUserActiveQuestionIdForQueue: -1,
}

export default ConfidentialQueuePanel
