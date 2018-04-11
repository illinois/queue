import React from 'react'
import PropTypes from 'prop-types'

import ActiveQuestionPanel from './ActiveQuestionPanel'
import NewQuestionContainer from '../containers/NewQuestionContainer'

const QuestionPanel = ({ queueId, userActiveQuestionId }) => {
  if (userActiveQuestionId !== -1) {
    return (
      <ActiveQuestionPanel
        queueId={queueId}
        questionId={userActiveQuestionId}
      />
    )
  }
  return <NewQuestionContainer queueId={queueId} />
}

QuestionPanel.propTypes = {
  queueId: PropTypes.number.isRequired,
  userActiveQuestionId: PropTypes.number.isRequired,
}

export default QuestionPanel
