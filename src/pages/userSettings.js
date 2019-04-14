import React from 'react'
import { connect } from 'react-redux'
import { Container } from 'reactstrap'

import PageWithUser from '../components/PageWithUser'
import UserProfilePanel from '../components/userSettings/UserProfilePanel'
import AccessTokensPanel from '../components/userSettings/AccessTokensPanel'

class UserSettings extends React.Component {
  static async getInitialProps() {
    // Do nothing for now
  }

  render() {
    return (
      <Container>
        <h1 className="display-4">User Settings</h1>
        <UserProfilePanel />
        <AccessTokensPanel />
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
  }
}

export default connect(mapStateToProps)(PageWithUser(UserSettings))
