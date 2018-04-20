import React from 'react'
import ConfirmModal from './ConfirmModal'

const ConfirmDeleteQueueModal = props => (
  <ConfirmModal
    isOpen={props.isOpen}
    toggle={props.toggle}
    confirm={props.confirm}
    descText="This queue and all its open questions will be deleted."
    confirmText="Delete queue"
  />
)

ConfirmDeleteQueueModal.propTypes = ConfirmModal.propTypes

export default ConfirmDeleteQueueModal
