import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

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
import ReactMarkdown from 'react-markdown'

class QueueMessage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false,
      editedMessage: null,
      activeTab: '1',
    }

    this.onMessageChanged = this.onMessageChanged.bind(this)
    this.onStartEdit = this.onStartEdit.bind(this)
    this.onFinishEdit = this.onFinishEdit.bind(this)
    this.onChangeTab = this.onChangeTab.bind(this)
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

  onChangeTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab })
    }
  }

  render() {
    const { message, isUserCourseStaff } = this.props
    const { editing, editedMessage } = this.state

    // If the user is not on course staff and the message is null or empty,
    // don't render the panel to them.
    if (!isUserCourseStaff && !message) {
      return null
    }

    const handleTabClick = (e, tab) => {
      e.stopPropagation()
      e.preventDefault()
      this.onChangeTab(tab)
    }

    const handleTabKeyPress = (e, tab) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.stopPropagation()
        this.onChangeTab(tab)
      }
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
                    active: this.state.activeTab === '1',
                  })}
                  onClick={e => handleTabClick(e, '1')}
                  tabIndex="0"
                  onKeyPress={e => handleTabKeyPress(e, '1')}
                >
                  Edit
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({
                    active: this.state.activeTab === '2',
                  })}
                  onClick={e => handleTabClick(e, '2')}
                  tabIndex="0"
                  onKeyPress={e => handleTabKeyPress(e, '2')}
                >
                  Preview
                </NavLink>
              </NavItem>
            </Nav>
          </CardHeader>
          <CardBody className="p-0">
            <TabContent activeTab={this.state.activeTab}>
              <TabPane className="m-2" tabId="1">
                <Input
                  type="textarea"
                  name="text"
                  rows="6"
                  value={editedMessage}
                  onChange={this.onMessageChanged}
                />
                <FormText color="muted">
                  You can use Markdown to format this message.
                </FormText>
              </TabPane>
              <TabPane className="m-3" tabId="2">
                <ReactMarkdown
                  source={
                    editedMessage === '' ? 'Nothing to preview' : editedMessage
                  }
                />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      )
      button = (
        <Button color="primary" onClick={this.onFinishEdit}>
          Save
        </Button>
      )
    } else {
      content = <ReactMarkdown source={message} />
      button = (
        <Button color="primary" onClick={this.onStartEdit}>
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
}

QueueMessage.propTypes = {
  queueId: PropTypes.number.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  updateQueue: PropTypes.func.isRequired,
}

export default QueueMessage
