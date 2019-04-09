import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Collapse } from 'reactstrap'
import {
  SOCKET_CONNECTED,
  SOCKET_CONNECTING,
  SOCKET_ERROR,
  SOCKET_STATUS_TYPES,
} from '../constants/socketStatus'

const SocketStatusAlert = ({ isOpen, status }) => {
  let message
  let color
  switch (status) {
    case SOCKET_CONNECTED:
      message = 'Connected'
      color = 'success'
      break
    case SOCKET_CONNECTING:
      message = 'Trying to connect...'
      color = 'warning'
      break
    case SOCKET_ERROR:
      message = 'Lost connection. Check your network and refresh the page.'
      color = 'danger'
      break
    default:
      return null
  }
  return (
    <Collapse isOpen={isOpen}>
      <Alert fade={false} color={color}>
        {message}
      </Alert>
    </Collapse>
  )
}

SocketStatusAlert.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  status: PropTypes.oneOf(SOCKET_STATUS_TYPES),
}

SocketStatusAlert.defaultProps = {
  status: null,
}

export default SocketStatusAlert
