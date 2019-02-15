import React from 'react'
import PropTypes from 'prop-types'
import { useBoolean } from 'react-hanger'
import classNames from 'classnames'

import { Card, CardHeader, CardBody, Collapse } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faEdit } from '@fortawesome/free-solid-svg-icons'

import ParrotMarkdown from './ParrotMarkdown'

const QueueMessageViewer = props => {
  const expanded = useBoolean(true)
  const { collapsible, editable, message, onEdit } = props

  const chevronClassNames = classNames({
    'new-question-expand': true,
    open: expanded.value,
  })

  const headerClassNames = classNames({
    'd-flex align-items-center': true,
    'new-question-header-clickable': collapsible,
  })

  const onEditClick = e => {
    e.stopPropagation()
    onEdit()
  }

  return (
    <Card color="primary" className="text-white">
      <CardHeader onClick={expanded.toggle} className={headerClassNames}>
        <span>Queue staff message</span>
        <div className="ml-auto">
          {editable && (
            <FontAwesomeIcon
              icon={faEdit}
              onClick={onEditClick}
              className="mr-3"
            />
          )}
          {collapsible && (
            <FontAwesomeIcon
              icon={faChevronDown}
              className={chevronClassNames}
            />
          )}
        </div>
      </CardHeader>
      <Collapse isOpen={expanded.value}>
        <CardBody>
          <ParrotMarkdown source={message} />
        </CardBody>
      </Collapse>
    </Card>
  )
}

QueueMessageViewer.propTypes = {
  message: PropTypes.string.isRequired,
  collapsible: PropTypes.bool.isRequired,
  editable: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
}

export default QueueMessageViewer
