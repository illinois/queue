import React from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

const ConfirmModal = props => {
  // if optionalCancelText is not empty, use its content,
  // otherwise use the word "Cancel" by default
  var cancelText = 'Cancel'
  if (props.optionalCancelText) {
    cancelText = props.optionalCancelText
  }

  return (
    <Modal isOpen={props.isOpen} toggle={props.toggle}>
      <ModalHeader>Are you sure?</ModalHeader>
      <ModalBody>{props.descText}</ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={props.confirm}>
          {props.confirmText}
        </Button>
        <Button color="secondary" onClick={props.toggle}>
          {cancelText}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  descText: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired,
  optionalCancelText: PropTypes.string,
}

export default ConfirmModal
