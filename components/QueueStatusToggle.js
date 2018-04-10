/* eslint-env browser */
import React from 'react'
import { Button } from 'reactstrap'

class QueueStatusToggle extends React.Component {
  constructor(props) {
    super(props)

    const enabled = window.localStorage.getItem('QueueStatus') === 'true'

    // Sync the notifications state to local storage TODO: change this to not using local storage
    localStorage.setItem('QueueStatus', enabled ? 'true' : 'false')

    this.state = {
      enabled,
    }
  }

  setQueueStatus(enabled) {
    localStorage.setItem('QueueStatus', enabled ? 'true' : 'false')
    this.setState({ enabled })
  }

  toggleQueueStatus() {
    this.setQueueStatus(!this.state.enabled)
    // TODO
  }

  render() {
    const text = this.state.enabled ? 'Open Queue' : 'Close Queue'
    const color = this.state.enabled ? 'success' : 'danger'
    const disabled = false

    return (
      <Button
        color={color}
        block
        disabled={disabled}
        className="mb-3 d-flex flex-row justify-content-center align-items-center"
        style={{ whiteSpace: 'normal' }}
        onClick={() => this.toggleQueueStatus()}
      >
        <span>{text}</span>
      </Button>
    )
  }
}

export default QueueStatusToggle
