/* eslint-env browser */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'reactstrap'
import getConfig from 'next/config'

import axios from '../actions/axios'

const { uidName, uidArticle } = getConfig().publicRuntimeConfig

class DevModeLogin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      uid: 'dev@illinois.edu',
    }

    this.handleUidChange = this.handleUidChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleUidChange(event) {
    this.setState({
      uid: event.target.value,
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    axios
      .post(
        '/login/dev',
        {
          uid: this.state.uid,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        window.location = this.props.redirect
      })
  }

  render() {
    return (
      <div>
        <p className="text-center text-muted">
          Looks like you&apos;re running in dev mode! Enter {uidArticle}{' '}
          {uidName} to emulate signing in as a different user.
        </p>
        <Form onSubmit={this.handleSubmit}>
          <Input
            placeholder="username"
            value={this.state.uid}
            className="text-center"
            onChange={this.handleUidChange}
          />
          <Button
            block
            type="button"
            className="mt-3"
            onClick={this.handleSubmit}
          >
            Dev log in
          </Button>
        </Form>
      </div>
    )
  }
}

DevModeLogin.propTypes = {
  redirect: PropTypes.string.isRequired,
}

export default DevModeLogin
