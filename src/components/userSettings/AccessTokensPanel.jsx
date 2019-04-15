import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  Button,
  ListGroup,
  ListGroupItem,
} from 'reactstrap'
import { useInput } from 'react-hanger'

import axios from '../../actions/axios'

import AccessTokenListGroupItem from './AccessTokenListGroupItem'
import Loading from '../Loading'

const AccessTokensPanel = () => {
  const newTokenNameInput = useInput('')
  const [tokensLoading, setTokensLoading] = useState(true)
  const [tokens, setTokens] = useState([])

  useEffect(() => {
    setTokensLoading(true)
    axios
      .get('/api/tokens')
      .then(res => {
        setTokensLoading(false)
        setTokens(res.data)
      })
      .catch(err => console.error(err))
  }, [])

  const createToken = e => {
    e.preventDefault()
    axios
      .post('/api/tokens', {
        name: newTokenNameInput.value,
      })
      .then(res => {
        setTokens([...tokens, res.data])
      })
      .catch(err => console.error(err))
  }

  const deleteToken = tokenId => {
    axios
      .delete(`/api/tokens/${tokenId}`)
      .then(() => {
        setTokens(tokens.filter(token => token.id !== tokenId))
      })
      .catch(err => console.error(err))
  }

  let listContent
  if (tokensLoading) {
    listContent = (
      <ListGroupItem key="__loading">
        <Loading />
      </ListGroupItem>
    )
  } else if (tokens.length === 0) {
    listContent = (
      <ListGroupItem key="__none">
        <span className="text-muted">
          You don&apos;t have any access tokens right now.
        </span>
      </ListGroupItem>
    )
  } else {
    listContent = tokens.map(token => (
      <AccessTokenListGroupItem
        {...token}
        key={token.id}
        onDeleteToken={() => deleteToken(token.id)}
      />
    ))
  }

  return (
    <Card className="mb-3">
      <CardHeader>
        <CardTitle tag="h5" className="mb-0">
          Access tokens
        </CardTitle>
      </CardHeader>
      <CardBody>
        You can create access tokens to access the Queue API without using
        Shibboleth authentication.
      </CardBody>
      <ListGroup flush>{listContent}</ListGroup>
      <CardBody className="bg-light">
        <Form autoComplete="off" onSubmit={createToken}>
          <InputGroup>
            <Input {...newTokenNameInput.bindToInput} />
            <InputGroupAddon addonType="append">
              <Button color="primary" type="submit">
                Add token
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Form>
      </CardBody>
    </Card>
  )
}

export default AccessTokensPanel
