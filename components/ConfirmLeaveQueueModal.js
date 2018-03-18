import React from 'react'
import ConfirmModal from './ConfirmModal'

const ConfirmLeaveQueueModal = props => (
  <ConfirmModal
    isOpen={props.isOpen}
    toggle={props.toggle}
    confirm={props.confirm}
    descText="If you leave the queue, you'll lose your spot and could have to wait longer to get help."
    confirmText="Leave queue"
  />
)

ConfirmLeaveQueueModal.propTypes = ConfirmModal.propTypes

export default ConfirmLeaveQueueModal
