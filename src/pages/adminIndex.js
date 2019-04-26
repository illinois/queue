import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'reactstrap'

import PageWithUser from '../components/PageWithUser'
import AdminUsersPanel from '../components/admin/AdminUsersPanel'
import ThemePreviewPanel from '../components/admin/ThemePreviewPanel'

const AdminIndex = ({ user }) => (
  <Container>
    <h1 className="display-4">Admin</h1>
    <AdminUsersPanel user={user} />
    <ThemePreviewPanel />
  </Container>
)

AdminIndex.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    uid: PropTypes.string,
  }).isRequired,
}

export default PageWithUser(AdminIndex, { requireAdmin: true })
