import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
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
import axiosBase from 'axios'
import FlipMove from 'react-flip-move'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import getConfig from 'next/config'

import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'

import axios from '../../actions/axios'
import Loading from '../Loading'

import RemoveableUserItem from '../RemoveableUserItem'

const { uidName } = getConfig().publicRuntimeConfig

interface AdminUsersPanelProps {
  user: {
    uid: string
    id: number
  }
}

interface Admin {
  id: number
  uid: string
  name: string
}

type AdminTypeahead = new () => AsyncTypeahead<Admin>
const AdminTypeahead = AsyncTypeahead as AdminTypeahead

const AdminUsersPanel = (props: AdminUsersPanelProps) => {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [adminsLoading, setAdminsLoading] = useState(true)
  const uidInput = useInput('')
  const [uidQuery] = useDebounce(uidInput.value, 500)
  const [userSuggestions, setUserSuggestions] = useState([])
  const [userSuggestionsLoading, setUserSuggestionsLoading] = useState(false)
  const [pendingAdmin, setPendingAdmin] = useState<Admin[]>([])

  useEffect(() => {
    axios
      .get('/api/users/admins')
      .then(res => {
        setAdmins(res.data)
        setAdminsLoading(false)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  useEffect((): (() => void) => {
    if (!uidQuery) {
      return () => {}
    }
    const source = axiosBase.CancelToken.source()
    setUserSuggestionsLoading(true)
    axios
      .get('/api/autocomplete/users', {
        params: {
          q: uidQuery,
        },
        cancelToken: source.token,
      })
      .then(res => {
        ReactDOM.unstable_batchedUpdates(() => {
          // The typeahead component will filter out existing admins
          setUserSuggestions(res.data)
          setUserSuggestionsLoading(false)
        })
      })
      .catch(err => {
        console.error(err)
      })
    return () => {
      source.cancel()
    }
  }, [uidQuery])

  const addAdmin = () => {
    const user = pendingAdmin[0]
    axios
      .put(`/api/users/admins/${user.id}`)
      .then(res => {
        setPendingAdmin([])
        setAdmins([...admins, res.data])
      })
      .catch(err => console.error(err))
  }

  const removeAdmin = (userId: number) => {
    axios
      .delete(`/api/users/admins/${userId}`)
      .then(() => {
        setAdmins(admins.filter(admin => admin.id !== userId))
      })
      .catch(err => console.error(err))
  }

  const handleKeyDown = (event: Event) => {
    if ((event as KeyboardEvent).key === 'Enter' && pendingAdmin.length > 0) {
      addAdmin()
    }
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
    contents = admins.map(admin => {
      // Don't allow users to remove themselves as admins
      const showRemoveButton = admin.id !== props.user.id
      return (
        <RemoveableUserItem
          key={admin.id}
          onRemove={removeAdmin}
          showRemoveButton={showRemoveButton}
          {...admin}
        />
      )
    })
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
    <Card className="mb-3">
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
        <FormText color="muted" className="mb-2">
          Search for users by {uidName}
        </FormText>
        <InputGroup>
          <AdminTypeahead
            id="admin-search"
            isLoading={userSuggestionsLoading}
            options={userSuggestions}
            onSearch={() => {
              /* This is handled by hooks, but prop must be specified */
            }}
            filterBy={option => {
              return admins.findIndex(admin => admin.id === option.id) === -1
            }}
            labelKey="uid"
            selected={pendingAdmin}
            onChange={options => setPendingAdmin(options)}
            onInputChange={value => uidInput.setValue(value)}
            minLength={1}
            useCache={false}
            onKeyDown={handleKeyDown}
            renderMenuItemChildren={(option, typeaheadProps) => {
              return (
                <>
                  <Highlighter search={typeaheadProps.text as string}>
                    {option.uid}
                  </Highlighter>
                  {option.name && (
                    <span className="text-muted ml-2">({option.name})</span>
                  )}
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

AdminUsersPanel.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
}

export default AdminUsersPanel
