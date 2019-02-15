import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useBoolean } from 'react-hanger'
import classNames from 'classnames'
import { Card, CardHeader, CardBody, Collapse } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faEdit } from '@fortawesome/free-solid-svg-icons'

import ParrotMarkdown from './ParrotMarkdown'
import QueueMessageEditor from './QueueMessageEditor'

const QueueMessage = props => {
  const [editing, setEditing] = useState(false)
  const expanded = useBoolean(true)
  const { message, isUserCourseStaff } = props

  // If the user is not on course staff and the message is null or empty,
  // don't render the panel to them.
  if (!isUserCourseStaff && !message) {
    return null
  }

  if (editing) {
    const handleSave = savedMessage => {
      const attributes = {
        message: savedMessage,
      }
      props.updateQueue(props.queueId, attributes).then(() => {
        setEditing(false)
      })
    }

    return (
      <QueueMessageEditor
        message={message}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
    )
  }

  const chevronClassNames = classNames({
    'new-question-expand': true,
    open: expanded.value,
  })

  const headerClassNames = classNames({
    'd-flex align-items-center': true,
    'new-question-header-clickable': isUserCourseStaff,
  })

  const onEditClick = e => {
    e.stopPropagation()
    setEditing(true)
  }

  return (
    <Card color="primary" className="text-white">
      <CardHeader onClick={expanded.toggle} className={headerClassNames}>
        <span>Queue staff message</span>
        {isUserCourseStaff && (
          <div className="ml-auto">
            <FontAwesomeIcon
              icon={faEdit}
              onClick={onEditClick}
              className="mr-3"
            />
            <FontAwesomeIcon
              icon={faChevronDown}
              className={chevronClassNames}
            />
          </div>
        )}
      </CardHeader>
      <Collapse isOpen={expanded.value}>
        <CardBody>
          <ParrotMarkdown source={message} />
        </CardBody>
      </Collapse>
    </Card>
  )
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
