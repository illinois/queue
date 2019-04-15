import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Card, CardHeader, CardBody, Collapse } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faEdit } from '@fortawesome/free-solid-svg-icons'
import css from 'styled-jsx/css'
import useLocalStorage from '@illinois/react-use-local-storage'

import ParrotMarkdown from './ParrotMarkdown'

const { className, styles } = css.resolve`
  .bg-primary-light {
    color: #004085;
    background-color: #cce5ff;
  }

  :global(body.darkmode) .bg-primary-light {
    color: inherit !important;
    background-color: #375a7f !important;
  }

  .bg-primary-light .card-header {
    background-color: #acd5ff;
  }

  .card-body > :global(*:last-child) {
    margin-bottom: 0;
  }

  .queue-message-expand {
    transition: transform 400ms;
  }

  .queue-message-expand.open {
    transform: rotateX(180deg);
  }

  .queue-message-header-clickable {
    cursor: pointer;
  }
`

const QueueMessageViewer = props => {
  const localStorageKey = `queue-message-${props.queueId}`
  const [expanded, setExpanded] = useLocalStorage(localStorageKey, true)
  const { collapsible, editable, message, onEdit } = props

  const chevronClassNames = classNames({
    [className]: true,
    'queue-message-expand': true,
    open: collapsible && expanded,
  })

  const headerClassNames = classNames({
    [className]: true,
    'd-flex align-items-center': true,
    'queue-message-header-clickable': collapsible,
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

  const onClickHeader = () => {
    if (collapsible) {
      setExpanded(!expanded)
    }
  }

  const messageVisible = !collapsible || expanded

  return (
    <Card className={`${className} bg-primary-light`}>
      <CardHeader onClick={onClickHeader} className={headerClassNames}>
        <strong>Queue staff message</strong>
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
      <Collapse isOpen={messageVisible}>
        <CardBody className={className}>
          <ParrotMarkdown source={message} />
        </CardBody>
      </Collapse>
      {styles}
    </Card>
  )
}

QueueMessageViewer.propTypes = {
  queueId: PropTypes.number.isRequired,
  message: PropTypes.string,
  collapsible: PropTypes.bool.isRequired,
  editable: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
}

QueueMessageViewer.defaultProps = {
  message: '',
}

export default QueueMessageViewer
