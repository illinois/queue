import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Form,
  FormGroup,
  Button,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap'
import getConfig from 'next/config'
import UserAutocomplete from './UserAutocomplete'

const { uidName, uidArticle } = getConfig().publicRuntimeConfig

const AddStaff = props => {
  const { user } = props
  const [pendingUser, setPendingUser] = useState([])
  const [uidInput, setUidInput] = useState()

  const handleAddStaff = e => {
    if (e) e.preventDefault()
    console.log(
      'AddStaff:: handleAddStaff - pendingUser[0] ' +
        JSON.stringify(pendingUser[0])
    )
    console.log(
      'AddStaff:: handleAddStaff - uidInput ' + JSON.stringify(uidInput)
    )
    if (pendingUser[0]) {
      return props.onAddStaff(pendingUser[0].id, null)
    }
    console.log(
      'pending user, which leads to onAddStaff attribute on AddStaff/ element',
      pendingUser[0]
    )
    return props.onAddStaff(null, uidInput)
  }

  // We want to exclude existing staff from the autocompletion list
  const filterBy = option => {
    return props.existingStaff.findIndex(u => u === option.id) === -1
  }
  return (
    <FormGroup>
      <Form
        autoComplete="off"
        className="d-flex align-items-center"
        style={{ flexWrap: 'nowrap' }}
        onSubmit={handleAddStaff}
      >
        <InputGroup>
          <UserAutocomplete
            id="user-input"
            setUidInput={setUidInput}
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
              disabled={user.isAdmin && pendingUser.length === 0}
            >
              Add staff
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </Form>
    </FormGroup>
  )
}

AddStaff.propTypes = {
  user: PropTypes.shape({
    isAdmin: PropTypes.bool,
  }).isRequired,
  // This is just an array of user IDs (not UIDs)
  existingStaff: PropTypes.arrayOf(PropTypes.number),
  onAddStaff: PropTypes.func.isRequired,
}

AddStaff.defaultProps = {
  existingStaff: [],
}

const mapStateToProps = state => ({
  user: state.user.user,
})

export default connect(mapStateToProps)(AddStaff)
