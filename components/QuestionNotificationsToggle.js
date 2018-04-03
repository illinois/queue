/* eslint-env browser */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, UncontrolledTooltip } from 'reactstrap'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faBell from '@fortawesome/fontawesome-free-solid/faBell'

class QuestionNotificationsToggle extends React.Component {
  constructor(props) {
    super(props)

    const supported = typeof window !== 'undefined' && 'Notification' in window
    const permission = (supported && Notification.permission) || null
    const enabled =
      supported &&
      permission === 'granted' &&
      window.localStorage.getItem('notificationsEnabled') === 'true'

    // Sync the notifications state to local storage
    localStorage.setItem('notificationsEnabled', enabled ? 'true' : 'false')

    this.state = {
      supported,
      enabled,
      permission,
    }

    // Sync notification setting between tabs
    if (supported) {
      window.addEventListener('storage', e => {
        if (e.key === 'notificationsEnabled') {
          this.setState({
            enabled: e.newValue === 'true',
          })
        }
      })
    }
  }

  setNotificationsEnabled(enabled) {
    localStorage.setItem('notificationsEnabled', enabled ? 'true' : 'false')
    this.setState({ enabled })
  }

  toggleNotificationsEnabled() {
    const hasBeenGranted =
      Notification.permission === 'denied' ||
      Notification.permission === 'granted'
    if (!hasBeenGranted) {
      // Request permissions first
      this.promptNotificationPermission(permission => {
        if (permission === 'granted') {
          this.setNotificationsEnabled(true)
        }
      })
    } else {
      this.setNotificationsEnabled(!this.state.enabled)
    }
  }

  promptNotificationPermission(callback) {
    if (
      'Notification' in window &&
      Notification.permission !== 'denied' &&
      Notification.permission !== 'granted'
    ) {
      Notification.requestPermission(permission => {
        this.setState({ permission })
        callback(permission)
      })
    }
  }

  render() {
    if (!this.state.supported) return null

    let text
    let color
    let disabled = false
    if (this.state.permission === 'denied') {
      text = 'Notifications disabled by browser'
      color = 'secondary'
      disabled = true
    } else if (this.state.permission !== 'granted') {
      text = 'Enable notifications'
      color = 'info'
    } else {
      text = this.state.enabled
        ? 'Disable notifications'
        : 'Enable notifications'
      color = this.state.enabled ? 'secondary' : 'info'
    }

    const tooltip = (
      <UncontrolledTooltip placement="right" target="notificationButton">
        {this.props.isStudent
          ? 'Get notifications for your question being answered!'
          : 'Get notifications for new questions when on-duty!'}
      </UncontrolledTooltip>
    )

    return (
      <div>
        <Button
          color={color}
          block
          disabled={disabled}
          id="notificationButton"
          className="mb-3 d-flex flex-row justify-content-center align-items-center"
          style={{ whiteSpace: 'normal' }}
          onClick={() => this.toggleNotificationsEnabled()}
        >
          <FontAwesomeIcon icon={faBell} className="mr-3" />
          <span>{text}</span>
        </Button>
        {tooltip}
      </div>
    )
  }
}

QuestionNotificationsToggle.propTypes = {
  isStudent: PropTypes.bool.isRequired,
}

export default QuestionNotificationsToggle
