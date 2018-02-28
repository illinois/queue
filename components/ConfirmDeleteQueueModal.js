import React from 'react'
import PropTypes from 'prop-types'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'reactstrap'

const ConfirmDeleteQueueModal = props => (
  <Modal isOpen={props.isOpen} toggle={props.toggle}>
    <ModalHeader>Are you sure?</ModalHeader>
    <ModalBody>
      This queue and all its open questions will be deleted.
    </ModalBody>
    <ModalFooter>
      <Button color="danger" onClick={props.confirm}>Delete queue</Button>
      <Button color="secondary" onClick={props.toggle}>Cancel</Button>
    </ModalFooter>
  </Modal>
)

ConfirmDeleteQueueModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
}

export default ConfirmDeleteQueueModal
