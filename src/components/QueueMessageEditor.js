import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useInput } from 'react-hanger'
import {
  Card,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  CardBody,
  TabContent,
  TabPane,
  Input,
  Button,
} from 'reactstrap'

import ParrotMarkdown from './ParrotMarkdown'

const QueueMessageEditor = props => {
  const messageInput = useInput(props.message || '')
  const messageInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState('1')
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.focus()
      messageInputRef.current.setSelectionRange(0, 0)
      messageInputRef.current.scrollTo(0, 0)
    }
  }, [])
  useEffect(() => {
    if (activeTab === '1' && messageInputRef.current) {
      messageInputRef.current.focus()
    }
  }, [activeTab])

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

  return (
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
      <CardBody className="p-2">
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Input
              type="textarea"
              name="text"
              rows="8"
              value={messageInput.value}
              onChange={messageInput.onChange}
              innerRef={messageInputRef}
            />
          </TabPane>
          <TabPane className="m-3" tabId="2">
            <ParrotMarkdown
              source={messageInput.value || 'Nothing to preview'}
            />
          </TabPane>
        </TabContent>
        <div className="d-flex flex-column flex-sm-row align-items-sm-center mt-2">
          <span className="text-muted small">
            You can use markdown to format this message.
          </span>
          <div className="ml-auto mt-2 mt-sm-0">
            <Button color="danger" onClick={() => props.onCancel()}>
              Cancel
            </Button>
            <Button
              color="primary"
              className="ml-1"
              onClick={() => props.onSave(messageInput.value)}
            >
              Save
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

QueueMessageEditor.propTypes = {
  message: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default QueueMessageEditor
