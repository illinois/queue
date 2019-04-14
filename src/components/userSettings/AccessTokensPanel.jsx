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
  Alert,
} from 'reactstrap'
import { useInput } from 'react-hanger'

import axios from '../../actions/axios'

const AccessTokensPanel = () => {
  const newTokenNameInput = useInput('')
  const [tokensLoading, setTokensLoading] = useState(true)
  const [tokens, setTokens] = useState([])

  useEffect(() => {
    setTokensLoading(true)
    axios
      .get('/api/tokens')
      .then(res => {
        console.log(res)
        setTokensLoading(false)
        setTokens(res.data)
      })
      .catch(err => console.error(err))
  }, [])

  const onCreateToken = e => {
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

  const copyValue = value => {
    document.execCommand('')
  }

  return (
    <Card className="mb-3">
      <CardHeader>
        <CardTitle tag="h5" className="mb-0">
          Access Tokens
        </CardTitle>
      </CardHeader>
      <CardBody>
        You can create access tokens to access the Queue API without using
        Shibboleth authentication.
      </CardBody>
      <ListGroup flush>
        {tokens.map(token => (
          <ListGroupItem key={token.id}>
            <div className="d-flex flex-column">
              <strong>{token.name}</strong>
              <span className="text-muted">Created at {token.createdAt}</span>
              <span className="text-muted">
                {token.lastUsedAt
                  ? `Last used at ${token.createdAt}`
                  : 'Never used'}
              </span>
            </div>
            {token.token && (
              <>
                <Alert fade={false} color="success" className="mt-3">
                  New access token created! Be sure to copy it now, as you
                  won&apos;t be able to see it later.
                  <InputGroup className="mt-2">
                    <Input
                      className="bg-light"
                      readOnly
                      value={token.token}
                      onFocus={e => e.target.select()}
                    />
                    <InputGroupAddon addonType="append">
                      <Button color="secondary" outline className="bg-light">
                        Copy
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </Alert>
              </>
            )}
          </ListGroupItem>
        ))}
      </ListGroup>
      <CardBody className="bg-light">
        <Form autoComplete="off" onSubmit={onCreateToken}>
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
