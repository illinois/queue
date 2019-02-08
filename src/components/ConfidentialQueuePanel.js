import React from 'react'
import PropTypes from 'prop-types'
import { ListGroupItem } from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

/* eslint-disable react/prefer-stateless-function */
class ConfidentialQueuePanel extends React.Component {
  render() {
    let questionId
    let position = 0
    if (this.props.queue && this.props.queue.questions) {
    this.props.queue.questions.forEach(qId => {
      const question = this.props.questions[qId]
      if (this.props.userId === question.askedById) {
        questionId = qId
      } else {
        position += 1
      }
    })

    const numQuestions = this.props.queue.questions.length
    if (numQuestions === 0) {
      return null;
    }
    const cardTotalQuestionsMessage =
      numQuestions === 1
        ? 'There is 1 person on the queue'
        : `There are ${numQuestions} people on the queue`
    const singularOrPluralPerson = position === 1 ? 'person' : 'people'
    const cardMessage = questionId
      ? `${cardTotalQuestionsMessage} with ${position} ${singularOrPluralPerson} in front of you.`
      : `${cardTotalQuestionsMessage}.`

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
  userId: PropTypes.number.isRequired,
}

ConfidentialQueuePanel.defaultProps = {
  queue: null,
  questions: null,
}

export default ConfidentialQueuePanel
