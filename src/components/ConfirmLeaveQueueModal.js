import React from 'react'
import PropTypes from 'prop-types'
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

ConfirmLeaveQueueModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
}

export default ConfirmLeaveQueueModal
