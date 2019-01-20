import React from 'react'
import PropTypes from 'prop-types'
import ConfirmModal from './ConfirmModal'

const ConfirmDeleteQueueModal = props => {
  const fullName =
    props.queueName && props.courseName
      ? `${props.courseName} ${props.queueName}`
      : 'This queue'
  return (
    <ConfirmModal
      isOpen={props.isOpen}
      toggle={props.toggle}
      confirm={props.confirm}
      descText={`${fullName} and all its open questions will be deleted. This cannot be undone`}
      confirmText="Delete queue"
    />
  )
}

ConfirmDeleteQueueModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  queueName: PropTypes.string,
  courseName: PropTypes.string,
}

ConfirmDeleteQueueModal.defaultProps = {
  queueName: null,
  courseName: null,
}

export default ConfirmDeleteQueueModal
