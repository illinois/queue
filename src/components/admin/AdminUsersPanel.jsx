import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  ListGroup,
  ListGroupItem,
  InputGroup,
  InputGroupAddon,
  Button,
  FormText,
} from 'reactstrap'
import { useInput } from 'react-hanger'
import { useDebounce } from 'use-debounce'
import { CancelToken } from 'axios'
import FlipMove from 'react-flip-move'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'

import axios from '../../actions/axios'
import Loading from '../Loading'

import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'
import AdminListItem from './AdminListItem'

const AdminUsersPanel = () => {
  const [admins, setAdmins] = useState([])
  const [adminsLoading, setAdminsLoading] = useState(true)
  const netidInput = useInput('')
  const [netidQuery] = useDebounce(netidInput.value, 500)
  const [userSuggestions, setUserSuggestions] = useState([])
  const [userSuggestionsLoading, setUserSuggestionsLoading] = useState(false)
  const [pendingAdmin, setPendingAdmin] = useState([])
  useEffect(() => {
    axios
      .get('/api/users/admins')
      .then(res => {
        setAdmins(res.data)
        setAdminsLoading(false)
      })
      .catch(err => {
        setAdmins(err)
      })
  }, [])
  useEffect(() => {
    if (!netidQuery) {
      return () => {}
    }
    const source = CancelToken.source()
    setUserSuggestionsLoading(true)
    axios
      .get('/api/autocomplete/users', {
        params: {
          q: netidQuery,
        },
        cancelToken: source.token,
      })
      .then(res => {
        setUserSuggestions(
          res.data.filter(user => {
            console.log('USER', user)
            console.log('ADMINS', admins)
            return admins.findIndex(admin => admin.netid === user.netid) === -1
          })
        )
        setUserSuggestionsLoading(false)
      })
      .catch(err => {})
    return () => {
      source.cancel()
    }
  }, [netidQuery])

  const addAdmin = () => {
    const user = pendingAdmin[0]
    console.log('adding adming!')
    console.log(user)
    setPendingAdmin([])
    setAdmins([...admins, user])
  }

  let contents
  if (adminsLoading) {
    contents = (
      <div>
        <ListGroupItem key="__loading">
          <Loading />
        </ListGroupItem>
      </div>
    )
  } else if (admins.length > 0) {
    contents = admins.map(admin => <AdminListItem key={admin.id} {...admin} />)
  } else {
    contents = (
      <div>
        <ListGroupItem key="__none">
          <span className="text-muted">There are no admins. Yikes.</span>
        </ListGroupItem>
      </div>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h5" className="mb-0">
          Admin users
        </CardTitle>
      </CardHeader>
      <ListGroup flush>
        <FlipMove
          enterAnimation="accordionVertical"
          leaveAnimation="accordionVertical"
          duration={200}
        >
          {contents}
        </FlipMove>
      </ListGroup>
      <CardBody className="bg-light">
        <FormText color="muted">Search for users by NetID</FormText>
        <InputGroup>
          <AsyncTypeahead
            isLoading={userSuggestionsLoading}
            options={userSuggestions}
            onSearch={() => {
              /* This is handled by hooks, but prop must be specified */
            }}
            labelKey="netid"
            selected={pendingAdmin}
            onChange={setPendingAdmin}
            onInputChange={netidInput.setValue}
            minLength={1}
            useCache={false}
            renderMenuItemChildren={(option, typeaheadProps) => {
              return (
                <>
                  {option.name && <h6>{option.name}</h6>}
                  <Highlighter search={typeaheadProps.text}>
                    {option.netid}
                  </Highlighter>
                </>
              )
            }}
          />
          <InputGroupAddon addonType="append">
            <Button
              color="primary"
              disabled={pendingAdmin.length === 0}
              onClick={addAdmin}
            >
              Add admin
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </CardBody>
    </Card>
  )
}

export default AdminUsersPanel
