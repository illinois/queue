import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'reactstrap'

import PageWithUser from '../components/PageWithUser'
import AdminUsersPanel from '../components/admin/AdminUsersPanel'

const AdminIndex = ({ user }) => (
  <Container>
    <h1 className="display-4">Admin</h1>
    <AdminUsersPanel user={user} />
  </Container>
)

AdminIndex.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    netid: PropTypes.string,
  }).isRequired,
}

export default PageWithUser(AdminIndex, { requireAdmin: true })
