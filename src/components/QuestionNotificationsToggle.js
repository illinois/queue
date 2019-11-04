/* eslint-env browser */
import React, { Fragment } from 'react'
import { Button, ButtonGroup } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'

import QuestionNotificationsToggleExplanationModal from './QuestionNotificationsToggleExplanationModal'

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
      showExplanationModal: false,
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

  toggleExplanationModal() {
    this.setState(prevState => ({
      showExplanationModal: !prevState.showExplanationModal,
    }))
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

    return (
      <Fragment>
        <ButtonGroup className="mb-3 d-block d-flex flex-row justify-content-center align-items-center">
          <Button
            color={color}
            disabled={disabled}
            id="notificationButton"
            className="d-flex flex-row justify-content-center align-items-center"
            style={{ whiteSpace: 'normal', flex: 20 }}
            onClick={() => this.toggleNotificationsEnabled()}
          >
            <FontAwesomeIcon icon={faBell} className="mr-3" />
            <span>{text}</span>
          </Button>
          <Button
            color={color}
            outline
            className="d-flex flex-row justify-content-center align-items-center align-self-stretch"
            style={{ whiteSpace: 'normal', flex: 1 }}
            onClick={() => this.toggleExplanationModal()}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </Button>
        </ButtonGroup>
        <QuestionNotificationsToggleExplanationModal
          isOpen={this.state.showExplanationModal}
          toggle={() => this.toggleExplanationModal()}
        />
      </Fragment>
    )
  }
}

export default QuestionNotificationsToggle
