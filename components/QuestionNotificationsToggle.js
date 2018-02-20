/* eslint-env browser */
import React from 'react'
import { Button } from 'reactstrap'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faBell from '@fortawesome/fontawesome-free-solid/faBell'

class QuestionNotificationsToggle extends React.Component {
  constructor(props) {
    super(props)

    const supported = (typeof window !== 'undefined' && 'Notification' in window)
    const enabled = (typeof window !== 'undefined' && window.localStorage.getItem('notificationsEnabled') === 'true')
    const permission = (supported && Notification.permission) || null

    this.state = {
      supported,
      enabled,
      permission,
    }

    // Sync notification setting between tabs
    if (supported) {
      window.addEventListener('storage', (e) => {
        if (e.key === 'notificationsEnabled') {
          this.setState({
            enabled: e.newValue === 'true',
          })
        }
      })
    }
  }

  toggleNotificationsEnabled() {
    const hasBeenGranted = (Notification.permission === 'denied' || Notification.permission === 'granted')
    if (!hasBeenGranted) {
      // Request permissions first
      this.promptNotificationPermission((permission) => {
        if (permission === 'granted') {
          localStorage.setItem('notifications_enabled', 'true')
        } else if (permission === 'denied') {
          localStorage.setItem('notifications_enabled', 'false')
        }
      })
    } else {
      const enabled = this.state.enabled ? 'false' : 'true'
      localStorage.setItem('notificationsEnabled', enabled)
      this.setState({ enabled: !this.state.enabled })
    }
  }

  promptNotificationPermission(callback) {
    if ('Notification' in window && Notification.permission !== 'denied' && Notification.permission !== 'granted') {
      Notification.requestPermission((permission) => {
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
      text = this.state.enabled ? 'Disable notifications' : 'Enable notifications'
      color = this.state.enabled ? 'secondary' : 'info'
    }

    return (
      <Button
        color={color}
        block
        disabled={disabled}
        className="mb-3"
        onClick={() => this.toggleNotificationsEnabled()}
      >
        <FontAwesomeIcon icon={faBell} className="mr-3" />
        {text}
      </Button>
    )
  }
}

export default QuestionNotificationsToggle
