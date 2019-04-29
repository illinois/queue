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
import moment from 'moment'

interface AdminTokenListGroupItemProps {
  createdAt: string
  lastUsedAt?: string
  name: string
  onDeleteToken: () => void
  token?: string
}

const AccessTokenListGroupItem = (props: AdminTokenListGroupItemProps) => {
  const inputRef = useRef<HTMLInputElement>() as React.RefObject<
    HTMLInputElement
  >

  const copyValue = (e: React.MouseEvent) => {
    if (inputRef.current) {
      inputRef.current.select()
      document.execCommand('copy')
      ;(e.target as HTMLButtonElement).focus()
    }
  }

  const createdAt = moment(props.createdAt)
  const createdAtHumanReadable = createdAt.fromNow()
  const createdAtCalendar = createdAt.calendar()
  const lastUsedAt = moment(props.lastUsedAt)
  const lastUsedAtHumanReadable = lastUsedAt.fromNow()
  const lastUsedAtCalendar = lastUsedAt.calendar()

  return (
    <ListGroupItem>
      <div className="d-flex flex-row align-items-center">
        <div className="d-flex flex-column">
          <strong>{props.name}</strong>
          <span className="text-muted" title={createdAtCalendar}>
            Created {createdAtHumanReadable}
          </span>
          <span className="text-muted" title={lastUsedAtCalendar}>
            {props.lastUsedAt
              ? `Last used ${lastUsedAtHumanReadable}`
              : 'Never used'}
          </span>
        </div>
        <Button
          color="danger"
          outline
          className="ml-auto"
          onClick={props.onDeleteToken}
        >
          Delete
        </Button>
      </div>
      {props.token && (
        <>
          <Alert fade={false} color="success" className="mt-3">
            <strong className="alert-heading">Token created!</strong>
            <br />
            Be sure to take note of it now, as you won&apos;t be able to see it
            later.
            <InputGroup className="mt-2">
              <Input
                className="bg-light"
                readOnly
                value={props.token}
                onFocus={e => e.target.select()}
                innerRef={inputRef}
              />
              <InputGroupAddon addonType="append">
                <Button color="secondary" onClick={copyValue}>
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
  name: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  lastUsedAt: PropTypes.string,
  token: PropTypes.string,
  onDeleteToken: PropTypes.func.isRequired,
}

AccessTokenListGroupItem.defaultProps = {
  lastUsedAt: null,
  token: null,
}

export default AccessTokenListGroupItem
