import React from 'react'
import { Form, InputGroup, InputGroupAddon, Input, Button } from 'reactstrap'

import axios from '../actions/axios'
import { Router } from '../routes'

class DevModeLogin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      netid: 'dev',
    }

    this.handleNetidChange = this.handleNetidChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleNetidChange(event) {
    this.setState({
      netid: event.target.value,
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    axios
      .post(
        '/login/dev',
        {
          netid: this.state.netid,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => Router.pushRoute('index'))
  }

  render() {
    return (
      <div>
        <p className="text-center text-secondary">
          Looks like you&apos;re running in dev mode! Enter a Net ID to emulate
          signing in as a different user.
        </p>
        <Form onSubmit={this.handleSubmit}>
          <InputGroup>
            <Input
              placeholder="username"
              value={this.state.netid}
              onChange={this.handleNetidChange}
            />
            <InputGroupAddon addonType="append">@illinois.edu</InputGroupAddon>
          </InputGroup>
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

export default DevModeLogin
