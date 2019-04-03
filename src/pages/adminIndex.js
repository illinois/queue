import React from 'react'
import { Container } from 'reactstrap'

import PageWithUser from '../components/PageWithUser'

class AdminIndex extends React.Component {
  render() {
    return (
      <Container>
        <h1 className="display-4">Admin</h1>
      </Container>
    )
  }
}

export default PageWithUser(AdminIndex)
