import React from 'react'
import PropTypes from 'prop-types'
import { useBoolean } from 'react-hanger'
import classNames from 'classnames'

import { Card, CardHeader, CardBody, Collapse } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faEdit } from '@fortawesome/free-solid-svg-icons'
import css from 'styled-jsx/css'

import ParrotMarkdown from './ParrotMarkdown'

const { className, styles } = css.resolve`
  .bg-primary-light {
    color: #004085;
    background-color: #cce5ff;
  }

  .bg-primary-light .card-header {
    background-color: #acd5ff;
  }

  .card-body > :global(*:last-child) {
    margin-bottom: 0;
  }
`

const QueueMessageViewer = props => {
  const expanded = useBoolean(true)
  const { collapsible, editable, message, onEdit } = props

  const chevronClassNames = classNames({
    'new-question-expand': true,
    open: expanded.value,
  })

  const headerClassNames = classNames({
    [className]: true,
    'd-flex align-items-center': true,
    'new-question-header-clickable': collapsible,
  })

  const onEditClick = e => {
    e.stopPropagation()
    onEdit()
  }

  const onEditKeyPress = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation()
      onEdit()
    }
  }

  return (
    <Card className={`${className} bg-primary-light`}>
      <CardHeader onClick={expanded.toggle} className={headerClassNames}>
        <span>Queue staff message</span>
        <div className="ml-auto">
          {editable && (
            <FontAwesomeIcon
              icon={faEdit}
              onClick={onEditClick}
              onKeyPress={onEditKeyPress}
              tabIndex="0"
              aria-hidden={false}
              aria-label="Edit message"
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
        <CardBody className={className}>
          <ParrotMarkdown source={message} />
        </CardBody>
      </Collapse>
      {styles}
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
