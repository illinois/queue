import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, InputGroup, InputGroupAddon } from 'reactstrap'
import getConfig from 'next/config'
import UserAutocomplete from './UserAutocomplete'

const { uidName, uidArticle } = getConfig().publicRuntimeConfig

const AddStaff = props => {
  const [pendingUser, setPendingUser] = useState([])

  const handleAddStaff = e => {
    console.log('wiggg')
    if (e) e.preventDefault()
    props.onAddStaff(pendingUser[0].id)
  }

  return (
    <Form
      autoComplete="off"
      className="d-flex align-items-center"
      style={{ flexWrap: 'nowrap' }}
      onSubmit={handleAddStaff}
    >
      <InputGroup>
        <UserAutocomplete
          id="user-input"
          selected={pendingUser}
          onChange={setPendingUser}
          placeholder={`Enter ${uidArticle} ${uidName}`}
        />
        <InputGroupAddon addonType="append">
          <Button
            color="primary"
            type="button"
            onClick={handleAddStaff}
            disabled={pendingUser.length === 0}
          >
            Add staff
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </Form>
  )
}

AddStaff.propTypes = {
  onAddStaff: PropTypes.func.isRequired,
}

export default AddStaff
