import React from 'react'
import PropTypes from 'prop-types'
import ConfirmModal from './ConfirmModal'

const ConfirmDeleteQueueModal = props => (
  <ConfirmModal
    isOpen={props.isOpen}
    toggle={props.toggle}
    confirm={props.confirm}
    descText="This queue will be deleted. This cannot be undone."
    confirmText="Delete queue"
  />
)

ConfirmDeleteQueueModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
}

export default ConfirmDeleteQueueModal
