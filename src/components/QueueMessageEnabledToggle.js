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
      <div className="mb-3 d-flex">
        <span className="mr-auto">Show staff message</span>
        <CustomInput
          id="messageEnabled"
          type="switch"
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
