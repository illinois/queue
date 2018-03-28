import React from 'react'
import PropTypes from 'prop-types'

import ActiveQuestionPanel from './ActiveQuestionPanel'
import NewQuestionContainer from '../containers/NewQuestionContainer'

const QuestionPanel = ({
  queueId,
  user,
  userActiveQuestionId,
  isUserActiveStaff,
}) => {
  if (isUserActiveStaff) {
    return null
  }
  if (userActiveQuestionId !== -1) {
    return (
      <ActiveQuestionPanel
        queueId={queueId}
        questionId={userActiveQuestionId}
      />
    )
  }
  return <NewQuestionContainer queueId={queueId} user={user} />
}

QuestionPanel.propTypes = {
  queueId: PropTypes.number.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  userActiveQuestionId: PropTypes.number.isRequired,
  isUserActiveStaff: PropTypes.bool.isRequired,
}

export default QuestionPanel
