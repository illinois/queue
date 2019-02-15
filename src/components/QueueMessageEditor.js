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
  FormText,
  Button,
} from 'reactstrap'

import ParrotMarkdown from './ParrotMarkdown'

const QueueMessageEditor = props => {
  const messageInput = useInput(props.message)
  const messageInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState('1')
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
              rows="6"
              value={messageInput.value}
              onChange={messageInput.onChange}
              innerRef={messageInputRef}
            />
            <FormText color="muted">
              You can use Markdown to format this message.
            </FormText>
          </TabPane>
          <TabPane className="m-3" tabId="2">
            <ParrotMarkdown
              source={messageInput.value || 'Nothing to preview'}
            />
          </TabPane>
        </TabContent>
        <Button
          color="primary"
          onClick={() => props.onSave(messageInput.value)}
        >
          Save
        </Button>
        <Button
          color="danger"
          className="ml-1"
          onClick={() => props.onCancel()}
        >
          Cancel
        </Button>
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
