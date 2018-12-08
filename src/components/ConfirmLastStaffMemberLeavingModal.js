import React from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

const ConfirmLastStaffMemberLeavingModal = props => (
  <Modal isOpen={props.isOpen} toggle={props.toggle}>
    <ModalHeader>You're the last on duty staff member!</ModalHeader>
    <ModalBody>Would you like to close the queue?</ModalBody>
    <ModalFooter>
      <Button color="danger" onClick={props.confirm}>
        Yes, Close Queue
      </Button>
      <Button color="secondary" onClick={props.toggle}>
        No, Leave Queue Open
      </Button>
    </ModalFooter>
  </Modal>
)

ConfirmLastStaffMemberLeavingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
}

export default ConfirmLastStaffMemberLeavingModal
