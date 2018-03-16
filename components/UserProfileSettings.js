import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, FormText, Button, Alert, Collapse } from 'reactstrap'

import { UPDATE_USER_PREFERRED_NAME } from '../constants/ActionTypes'

class UserProfileSettings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: (props.user && props.user.preferredName) || '',
      preferredNameUpdateStatus: {
        succeeded: null,
        message: null,
        isOpen: false,
      },
    }

    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentWillUnmount() {
    this.clearPreferredNameUpdateStatusTimeout()
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleChangePreferredName(e) {
    if (e) e.preventDefault()
    this.props.updateUserPreferredName(this.state.name).then(action => {
      if (action && action.type === UPDATE_USER_PREFERRED_NAME.SUCCESS) {
        this.setState({
          preferredNameUpdateStatus: {
            message: 'Successfully updated preferred name!',
            succeeded: true,
            isOpen: true,
          },
        })
      } else {
        this.setState({
          preferredNameUpdateStatus: {
            message: 'Failed to update preferred name. Please try again later.',
            succeeded: false,
            isOpen: true,
          },
        })
      }
      this.clearPreferredNameUpdateStatusTimeout()
      this.preferredNameUpdateStatusTimeout = setTimeout(() => {
        this.setState({
          preferredNameUpdateStatus: {
            ...this.state.preferredNameUpdateStatus,
            isOpen: false,
          },
        })
        this.preferredNameUpdateStatusTimeout = null
      }, 3000)
    })
  }

  clearPreferredNameUpdateStatusTimeout() {
    if (this.preferredNameUpdateStatusTimeout) {
      clearTimeout(this.preferredNameUpdateStatusTimeout)
      this.preferredNameUpdateStatusTimeout = null
    }
  }

  render() {
    const { user } = this.props

    return (
      <div>
        <div className="mb-3">
          <div className="text-muted small">Net ID</div>
          <div>{user.netid}</div>
        </div>
        <div className="mb-3">
          <div className="text-muted small">University Name</div>
          <div>{user.universityName || 'No name :('}</div>
        </div>
        <div>
          <div className="text-muted small">Preferred Name</div>
          <Form
            autoComplete="off"
            className="d-flex align-items-center mt-2"
            style={{ flexWrap: 'nowrap' }}
            onSubmit={e => this.handleChangePreferredName(e)}
          >
            <Input
              type="text"
              name="name"
              placeholder="Enter your preferred name"
              className="mr-3"
              onChange={this.handleInputChange}
              value={this.state.name}
            />
            <Button
              color="primary"
              type="button"
              onClick={() => this.handleChangePreferredName()}
            >
              Update
            </Button>
          </Form>
          <Collapse isOpen={!!this.state.preferredNameUpdateStatus.isOpen}>
            <Alert
              color={
                this.state.preferredNameUpdateStatus.succeeded
                  ? 'success'
                  : 'danger'
              }
              className="mt-3 small"
            >
              {this.state.preferredNameUpdateStatus.message}
            </Alert>
          </Collapse>
          <FormText color="muted">
            If you go by a different name than that in the school&apos;s records
            or have a preferred nickname, you can enter that here. This will be
            used to pre-fill your name when you&apos;re adding a new question.
          </FormText>
        </div>
      </div>
    )
  }
}

UserProfileSettings.propTypes = {
  user: PropTypes.shape({
    universityName: PropTypes.string,
    preferredName: PropTypes.string,
  }).isRequired,
  updateUserPreferredName: PropTypes.func.isRequired,
}

export default UserProfileSettings
