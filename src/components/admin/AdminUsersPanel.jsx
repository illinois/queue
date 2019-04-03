import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  ListGroup,
  ListGroupItem,
  InputGroup,
  Input,
  InputGroupButton,
  Button,
} from 'reactstrap'

import axios from '../../actions/axios'

const AdminUsersPanel = () => {
  const [admins, setAdmins] = useState([])
  useEffect(() => {
    axios
      .get('/api/users/admins')
      .then(res => {
        setAdmins(res.data)
      })
      .catch(err => {
        setAdmins(err)
      })
  }, [])

  let adminItems
  if (admins.length > 0) {
    adminItems = admins.map(admin => (
      <ListGroupItem>{admin.netid}</ListGroupItem>
    ))
  } else {
    adminItems = (
      <ListGroupItem>
        <span className="text-muted">There are no admins. Yikes.</span>
      </ListGroupItem>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h5" className="mb-0">
          Admin users
        </CardTitle>
      </CardHeader>
      <ListGroup flush>{adminItems}</ListGroup>
      <CardBody className="bg-light">
        <p>Search for users by NetID or name</p>
        <InputGroup>
          <Input />
          <InputGroupButton addonType="append">
            <Button color="primary">Add admin</Button>
          </InputGroupButton>
        </InputGroup>
      </CardBody>
    </Card>
  )
}

export default AdminUsersPanel
