import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  getUserActiveQuestionIdForQueue,
} from '../selectors'

import ActiveQuestionPanel from './ActiveQuestionPanel'
import NewQuestionContainer from '../containers/NewQuestionContainer'

const QuestionPanel = ({ queueId, userActiveQuestionId }) => {
  if (userActiveQuestionId !== -1) {
    return (
      <ActiveQuestionPanel queueId={queueId} questionId={userActiveQuestionId} />
    )
  }
  return (
    <NewQuestionContainer queueId={queueId} />
  )
}

QuestionPanel.propTypes = {
  queueId: PropTypes.number.isRequired,
  userActiveQuestionId: PropTypes.number.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  userActiveQuestionId: getUserActiveQuestionIdForQueue(state, ownProps),
})

export default connect(mapStateToProps, null)(QuestionPanel)
