/* eslint-env browser */
import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'

class QueueStatusToggle extends React.Component {
  toggleQueueStatus() {
    const attributes = { open: !this.props.queue.open }
    this.props.updateQueueStatus(this.props.queue.id, attributes)
  }

  render() {
    const text = this.props.queue.open ? 'Close Queue' : 'Open Queue'
    const color = this.props.queue.open ? 'danger' : 'success'

    return (
      <Button
        color={color}
        block
        className="mb-3 d-flex flex-row justify-content-center align-items-center"
        style={{ whiteSpace: 'normal' }}
        onClick={() => this.toggleQueueStatus()}
      >
        <span>{text}</span>
      </Button>
    )
  }
}

QueueStatusToggle.defaultProps = {
  queue: null,
}

QueueStatusToggle.propTypes = {
  queue: PropTypes.shape({
    id: PropTypes.number,
    open: PropTypes.bool,
  }),
  updateQueueStatus: PropTypes.func.isRequired,
}

export default QueueStatusToggle
