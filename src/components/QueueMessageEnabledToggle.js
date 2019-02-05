import React from 'react'
import PropTypes from 'prop-types'
import { CustomInput } from 'reactstrap'

class QueueMessageEnabledToggle extends React.Component {
  constructor(props) {
    super(props)
    this.handleCheckChanged = this.handleCheckChanged.bind(this)
  }

  handleCheckChanged(e) {
    const attributes = {
      messageEnabled: e.target.checked,
    }
    this.props.updateQueue(this.props.queue.id, attributes)
  }

  render() {
    return (
      <div className="mb-3 d-flex align-items-center">
        <div className="d-flex flex-column mr-auto">
          <span>Show staff message</span>
          <span className="small text-muted">
            This affects anyone using this queue
          </span>
        </div>
        <CustomInput
          id="messageEnabled"
          type="switch"
          className="ml-3"
          onChange={this.handleCheckChanged}
          checked={this.props.queue.messageEnabled}
        />
      </div>
    )
  }
}

QueueMessageEnabledToggle.defaultProps = {
  queue: null,
}

QueueMessageEnabledToggle.propTypes = {
  queue: PropTypes.shape({
    id: PropTypes.number,
    messageEnabled: PropTypes.bool,
  }),
  updateQueue: PropTypes.func.isRequired,
}

export default QueueMessageEnabledToggle
