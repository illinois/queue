import React from 'react'
import PropTypes from 'prop-types'

import { Alert, Button, FormText, Input } from 'reactstrap'
import ReactMarkdown from 'react-markdown'

class QueueMessage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false,
      editedMessage: null,
    }

    this.onMessageChanged = this.onMessageChanged.bind(this)
    this.onStartEdit = this.onStartEdit.bind(this)
    this.onFinishEdit = this.onFinishEdit.bind(this)
  }

  onMessageChanged(e) {
    this.setState({
      editedMessage: e.target.value,
    })
  }

  onStartEdit() {
    this.setState({
      editing: true,
      editedMessage: this.props.message,
    })
  }

  onFinishEdit() {
    const attributes = {
      message: this.state.editedMessage,
    }
    this.props.updateQueue(this.props.queueId, attributes).then(() => {
      this.setState({ editing: false })
    })
  }

  render() {
    const { message, isUserCourseStaff } = this.props
    const { editing, editedMessage } = this.state

    // If the user is not on course staff and the message is null or empty,
    // don't render the panel to them.
    if (!isUserCourseStaff && !message) {
      return null
    }

    let content
    let button
    if (editing) {
      content = (
        <>
          <Input type="textarea" name="text" rows="6" value={editedMessage} onChange={this.onMessageChanged} />
          <FormText color="muted">
            You can use Markdown to format this message.
          </FormText>
        </>
      )
      button = <Button color="primary" onClick={this.onFinishEdit}>Save</Button>
    } else {
      content = <ReactMarkdown source={message} />
      button = <Button color="primary" onClick={this.onStartEdit}>Edit</Button>
    }

    return (
      <Alert color="primary">
        <h6 className="alert-heading">A message from the queue staff</h6>
        {content}
        {isUserCourseStaff && (
          <div className="mt-3">{button}</div>
        )}
      </Alert>
    )
  }
}

QueueMessage.propTypes = {
  queueId: PropTypes.number.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  updateQueue: PropTypes.func.isRequired,
}

export default QueueMessage
