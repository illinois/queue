import React from 'react'
import { connect } from 'react-redux'
import { Container, Card, CardHeader, CardTitle, CardBody } from 'reactstrap'

import PageWithUser from '../components/PageWithUser'
import UserProfileSettingsContainer from '../containers/UserProfileSettingsContainer'
import HeadTitle from '../components/HeadTitle'

class UserSettings extends React.Component {
  static async getInitialProps() {
    // Do nothing for now
  }

  render() {
    return (
      <Container fluid>
        <HeadTitle title="User Settings" />
        <Card className="settings-card">
          <CardHeader className="bg-primary text-white d-flex align-items-center">
            <CardTitle tag="h4" className="mb-0">
              Settings
            </CardTitle>
          </CardHeader>
          <CardBody>
            <CardTitle tag="h5">User profile</CardTitle>
            <UserProfileSettingsContainer />
          </CardBody>
        </Card>
        <style jsx>{`
          :global(.settings-card) {
            width: 100%;
            max-width: 500px;
            margin: auto;
          }
        `}</style>
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
