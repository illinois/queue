import React from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

const ConfirmModal = props => (
  <Modal isOpen={props.isOpen} toggle={props.toggle}>
    <ModalHeader>Are you sure?</ModalHeader>
    <ModalBody>{props.descText}</ModalBody>
    <ModalFooter>
      <Button color="danger" onClick={props.confirm}>
        {props.confirmText}
      </Button>
      <Button color="secondary" onClick={props.toggle}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
)

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  descText: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired,
}

export default ConfirmModal
