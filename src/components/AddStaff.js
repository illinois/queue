import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, InputGroup, InputGroupAddon } from 'reactstrap'
import getConfig from 'next/config'
import UserAutocomplete from './UserAutocomplete'

const { uidName, uidArticle } = getConfig().publicRuntimeConfig

const AddStaff = props => {
  const [pendingUser, setPendingUser] = useState([])

  const handleAddStaff = e => {
    if (e) e.preventDefault()
    props.onAddStaff(pendingUser[0].id)
  }

  // We want to exclude existing staff from the autocompletion list
  const filterBy = option => {
    return props.existingStaff.findIndex(user => user === option.id) === -1
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
          filterBy={filterBy}
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
  // This is just an array of user IDs (not UIDs)
  existingStaff: PropTypes.arrayOf(PropTypes.number),
  onAddStaff: PropTypes.func.isRequired,
}

AddStaff.defaultProps = {
  existingStaff: [],
}

export default AddStaff
