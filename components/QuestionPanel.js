import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getUserActiveQuestionIdForQueue } from '../selectors'

import ActiveQuestionPanel from './ActiveQuestionPanel'
import QuestionBeingAnsweredPanel from './QuestionBeingAnsweredPanel'
import NewQuestionContainer from '../containers/NewQuestionContainer'

const QuestionPanel = ({ queueId, user, questions, userActiveQuestionId }) => {
  if (userActiveQuestionId !== -1) {
    const question = questions[userActiveQuestionId]
    if (question.answeredById) {
      // The question is currently being answered
      return (
        <QuestionBeingAnsweredPanel
          queueId={queueId}
          questionId={userActiveQuestionId}
        />
      )
    }
    return (
      <ActiveQuestionPanel
        queueId={queueId}
        questionId={userActiveQuestionId}
      />
    )
  }
  return <NewQuestionContainer queueId={queueId} user={user} />
}

QuestionPanel.defaultProps = {
  questions: {},
}

QuestionPanel.propTypes = {
  queueId: PropTypes.number.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  questions: PropTypes.objectOf(
    PropTypes.shape({
      answeredById: PropTypes.number,
    })
  ),
  userActiveQuestionId: PropTypes.number.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user.user,
  userActiveQuestionId: getUserActiveQuestionIdForQueue(state, ownProps),
  questions: state.questions.questions,
})

export default connect(mapStateToProps, null)(QuestionPanel)
