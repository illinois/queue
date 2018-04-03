import React from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

const QuestionNotificationsToggleExplanationModal = props => (
  <Modal isOpen={props.isOpen} toggle={props.toggle}>
    <ModalHeader>Question notifications</ModalHeader>
    <ModalBody>
      <h5>For students</h5>
      <p>
        If you enable notificaitons, you&apos;ll get notifications when your
        question is being answered.
      </p>
      <h5>For course staff/admins</h5>
      <p>
        If you enable notifications, you&apos;ll get notifications when a
        student adds a new question to the queue.
      </p>
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={props.toggle}>
        Got it
      </Button>
    </ModalFooter>
  </Modal>
)

QuestionNotificationsToggleExplanationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
}

export default QuestionNotificationsToggleExplanationModal
