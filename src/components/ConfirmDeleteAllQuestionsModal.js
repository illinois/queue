import React from 'react'
import PropTypes from 'prop-types'
import ConfirmModal from './ConfirmModal'

const ConfirmDeleteAllQuestionsModal = props => (
  <ConfirmModal
    isOpen={props.isOpen}
    toggle={props.toggle}
    confirm={props.confirm}
    descText="This will delete ALL questions currently on the queue."
    confirmText="Delete all questions"
  />
)

ConfirmDeleteAllQuestionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
}

export default ConfirmDeleteAllQuestionsModal
