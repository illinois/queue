/* eslint-env browser */
import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import {
  ListGroupItem,
  Alert,
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
} from 'reactstrap'

const AccessTokenListGroupItem = props => {
  const inputRef = useRef()

  const copyValue = e => {
    inputRef.current.select()
    document.execCommand('copy')
    e.target.focus()
  }

  return (
    <ListGroupItem key={props.id}>
      <div className="d-flex flex-column">
        <strong>{props.name}</strong>
        <span className="text-muted">Created at {props.createdAt}</span>
        <span className="text-muted">
          {props.lastUsedAt ? `Last used at ${props.createdAt}` : 'Never used'}
        </span>
      </div>
      {props.token && (
        <>
          <Alert fade={false} color="success" className="mt-3">
            New access token created! Be sure to copy it now, as you won&apos;t
            be able to see it later.
            <InputGroup className="mt-2">
              <Input
                className="bg-light"
                readOnly
                value={props.token}
                onFocus={e => e.target.select()}
                innerRef={inputRef}
              />
              <InputGroupAddon addonType="append">
                <Button
                  color="secondary"
                  outline
                  className="bg-light"
                  onClick={copyValue}
                >
                  Copy
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Alert>
        </>
      )}
    </ListGroupItem>
  )
}

AccessTokenListGroupItem.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  lastUsedAt: PropTypes.string,
  token: PropTypes.string,
}

AccessTokenListGroupItem.defaultProps = {
  lastUsedAt: null,
  token: null,
}

export default AccessTokenListGroupItem
