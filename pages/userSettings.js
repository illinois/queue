import React from 'react'
import withRedux from 'next-redux-wrapper'
import { Container, Card, CardHeader, CardTitle, CardBody } from 'reactstrap'

import makeStore from '../redux/makeStore'

import PageWithUser from '../components/PageWithUser'
import Layout from '../components/Layout'
import UserProfileSettingsContainer from '../containers/UserProfileSettingsContainer'

class UserSettings extends React.Component {
  static async getInitialProps() {
    // Do nothing for now
  }

  render() {
    return (
      <Layout>
        <Container fluid>
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
        </Container>
        <style jsx>{`
          :global(.settings-card) {
            width: 100%;
            max-width: 500px;
            margin: auto;
          }
        `}</style>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
  }
}

export default withRedux(makeStore, mapStateToProps, null)(
  PageWithUser(UserSettings)
)
