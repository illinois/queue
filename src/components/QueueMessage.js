import React, { useState } from 'react'
import PropTypes from 'prop-types'

import QueueMessageEditor from './QueueMessageEditor'
import QueueMessageViewer from './QueueMessageViewer'

const QueueMessage = props => {
  const [editing, setEditing] = useState(false)
  const { message, isUserCourseStaff } = props

  // If the user is not on course staff and the message is null or empty,
  // don't render the panel to them.
  if (!isUserCourseStaff && !message) {
    return null
  }

  let content

  if (editing) {
    const handleSave = savedMessage => {
      const attributes = {
        message: savedMessage,
      }
      props.updateQueue(props.queueId, attributes).then(() => {
        setEditing(false)
      })
    }

    content = (
      <QueueMessageEditor
        message={message}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
    )
  } else {
    content = (
      <QueueMessageViewer
        queueId={props.queueId}
        message={message}
        editable={isUserCourseStaff}
        collapsible={isUserCourseStaff}
        onEdit={() => setEditing(true)}
      />
    )
  }

  return <div className="mb-3">{content}</div>
}

QueueMessage.defaultProps = {
  message: '',
}

QueueMessage.propTypes = {
  queueId: PropTypes.number.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
  message: PropTypes.string,
  updateQueue: PropTypes.func.isRequired,
}

export default QueueMessage
