import React from 'react'
import ConfirmModal from './ConfirmModal'

const ConfirmDeleteQuestionModal = props => (
  <ConfirmModal
    isOpen={props.isOpen}
    toggle={props.toggle}
    confirm={props.confirm}
    descText="This question will be deleted."
    confirmText="Delete question"
  />
)

ConfirmDeleteQuestionModal.propTypes = ConfirmModal.propTypes

export default ConfirmDeleteQuestionModal
