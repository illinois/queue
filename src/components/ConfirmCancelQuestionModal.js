import React from 'react'
import PropTypes from 'prop-types'
import ConfirmModal from './ConfirmModal'

const ConfirmCancelQuestionModal = props => (
  <ConfirmModal
    isOpen={props.isOpen}
    toggle={props.toggle}
    confirm={props.confirm}
    descText="You will stop answering this question but this question will stay in the queue."
    confirmText="Stop Answering"
    optionalCancelText="Resume Answering"
  />
)

ConfirmCancelQuestionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
}

export default ConfirmCancelQuestionModal
