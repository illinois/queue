import React from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

const SocketErrorModal = ({ isOpen }) => (
  <Modal isOpen={isOpen}>
    <ModalHeader>Socket error</ModalHeader>
    <ModalBody>
      <p>
        There was an error connecting to the socket to receive realtime updates.
        This is a known issue and we are working to identify the root cause. If
        you&apos;d like to help us fix this problem, please reach out to Wade at{' '}
        <a href="mailto:waf@illinois.edu">waf@illinois.edu</a> so that the Queue
        developers can get in touch with you! In the meantime, please try
        accessing the Queue from another browser or device.
      </p>
    </ModalBody>
  </Modal>
)

SocketErrorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
}

export default SocketErrorModal
