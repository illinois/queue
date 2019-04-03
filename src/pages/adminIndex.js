import React from 'react'
import { Container } from 'reactstrap'

import PageWithUser from '../components/PageWithUser'
import AdminUsersPanel from '../components/admin/AdminUsersPanel'

class AdminIndex extends React.Component {
  render() {
    return (
      <Container>
        <h1 className="display-4">Admin</h1>
        <AdminUsersPanel />
      </Container>
    )
  }
}

export default PageWithUser(AdminIndex)
