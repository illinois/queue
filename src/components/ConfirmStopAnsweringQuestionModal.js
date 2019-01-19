import React from 'react'
import PropTypes from 'prop-types'
import ConfirmModal from './ConfirmModal'

const ConfirmStopAnsweringQuestionModal = props => (
  <ConfirmModal
    isOpen={props.isOpen}
    toggle={props.toggle}
    confirm={props.confirm}
    descText="You will stop answering this question but it will stay in the queue."
    confirmText="Stop Answering"
    optionalCancelText="Resume Answering"
  />
)

ConfirmStopAnsweringQuestionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
}

export default ConfirmStopAnsweringQuestionModal
