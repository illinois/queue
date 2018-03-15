import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  getUserActiveQuestionIdForQueue,
  isUserActiveStaffForQueue,
} from '../selectors'

import QuestionPanel from '../components/QuestionPanel'

const QuestionPanelContainer = ({
  queueId,
  user,
  userActiveQuestionId,
  isUserActiveStaff,
}) => {
  return (
    <QuestionPanel
      queueId={queueId}
      user={user}
      userActiveQuestionId={userActiveQuestionId}
      isUserActiveStaff={isUserActiveStaff}
    />
  )
}

QuestionPanelContainer.propTypes = {
  queueId: PropTypes.number.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  userActiveQuestionId: PropTypes.number.isRequired,
  isUserActiveStaff: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user.user,
  userActiveQuestionId: getUserActiveQuestionIdForQueue(state, ownProps),
  isUserActiveStaff: isUserActiveStaffForQueue(state, ownProps),
})

export default connect(mapStateToProps, null)(QuestionPanelContainer)
