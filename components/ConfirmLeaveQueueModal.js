import React from 'react'
import PropTypes from 'prop-types'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'reactstrap'

const ConfirmLeaveQueueModal = props => (
  <Modal isOpen={props.isOpen} toggle={props.toggle}>
    <ModalHeader>Are you sure?</ModalHeader>
    <ModalBody>
      If you leave the queue, you&apos;ll lose your spot and could have
      to wait longer to get help.
    </ModalBody>
    <ModalFooter>
      <Button color="danger" onClick={props.confirm}>Leave queue</Button>
      <Button color="secondary" onClick={props.toggle}>Cancel</Button>
    </ModalFooter>
  </Modal>
)

ConfirmLeaveQueueModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
}

export default ConfirmLeaveQueueModal
