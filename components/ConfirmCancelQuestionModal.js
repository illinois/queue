import React from 'react'
import ConfirmModal from './ConfirmModal'

const ConfirmCancelQuestionModal = props => (
  <ConfirmModal
    isOpen={props.isOpen}
    toggle={props.toggle}
    confirm={props.confirm}
    descText={'You will stop answering this question.'}
    confirmText={'Cancel question'}
  />
)

export default ConfirmCancelQuestionModal
