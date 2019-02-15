import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useInput } from 'react-hanger'

import {
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  FormText,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap'
import ParrotMarkdown from './ParrotMarkdown'

const QueueMessage = props => {
  const [editing, setEditing] = useState(false)
  const editedMessage = useInput('')
  const [activeTab, setActiveTab] = useState('1')
  const inputRef = useRef(null)
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editing])
  useEffect(() => {
    if (activeTab === '1' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [activeTab])

  const { message, isUserCourseStaff } = props

  // If the user is not on course staff and the message is null or empty,
  // don't render the panel to them.
  if (!isUserCourseStaff && !message) {
    return null
  }

  const handleTabClick = (e, tab) => {
    e.stopPropagation()
    e.preventDefault()
    setActiveTab(tab)
  }

  const handleTabKeyPress = (e, tab) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation()
      setActiveTab(tab)
    }
  }

  const startEditing = () => {
    setEditing(true)
    editedMessage.setValue(props.message || '')
  }

  const finishEditing = () => {
    const attributes = {
      message: editedMessage.value,
    }
    props.updateQueue(props.queueId, attributes).then(() => {
      setEditing(false)
    })
  }

  let content
  let button
  if (editing) {
    content = (
      <Card>
        <CardHeader>
          <Nav card tabs>
            <NavItem>
              <NavLink
                href="#"
                className={classnames({
                  active: activeTab === '1',
                })}
                onClick={e => handleTabClick(e, '1')}
                onKeyPress={e => handleTabKeyPress(e, '1')}
                role="tab"
                aria-selected={activeTab === '1'}
              >
                Edit
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                className={classnames({
                  active: activeTab === '2',
                })}
                onClick={e => handleTabClick(e, '2')}
                onKeyPress={e => handleTabKeyPress(e, '2')}
                role="tab"
                aria-selected={activeTab === '2'}
              >
                Preview
              </NavLink>
            </NavItem>
          </Nav>
        </CardHeader>
        <CardBody className="p-0">
          <TabContent activeTab={activeTab}>
            <TabPane className="m-2" tabId="1">
              <Input
                type="textarea"
                name="text"
                rows="6"
                value={editedMessage.value}
                onChange={editedMessage.onChange}
                innerRef={inputRef}
              />
              <FormText color="muted">
                You can use Markdown to format this message.
              </FormText>
            </TabPane>
            <TabPane className="m-3" tabId="2">
              <ParrotMarkdown
                source={editedMessage.value || 'Nothing to preview'}
              />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    )
    button = (
      <>
        <Button color="primary" onClick={finishEditing}>
          Save
        </Button>
        <Button
          color="danger"
          className="ml-1"
          onClick={() => setEditing(false)}
        >
          Cancel
        </Button>
      </>
    )
  } else {
    content = <ParrotMarkdown source={message} />
    button = (
      <Button color="primary" onClick={startEditing}>
        Edit
      </Button>
    )
  }

  return (
    <Alert color="primary" fade={false}>
      <h6 className="alert-heading">A message from the queue staff</h6>
      {content}
      {isUserCourseStaff && <div className="mt-3">{button}</div>}
    </Alert>
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
