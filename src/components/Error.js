import React from 'react'
import PropTypes from 'prop-types'
import HTTPStatus from 'http-status'
import { Button } from 'reactstrap'

import { Link } from '../routes'
import { useTheme } from './ThemeProvider'

const styles = {
  error: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '60px',
  },

  h1: {
    margin: 0,
    fontSize: '60px',
    fontWeight: 500,
    verticalAlign: 'top',
  },

  h2: {
    fontSize: '14px',
    fontWeight: 'normal',
    lineHeight: 'inherit',
    margin: 0,
    padding: 0,
  },
}

const Error = props => {
  const { isDarkMode } = useTheme()
  const { statusCode } = props
  const title = statusCode !== null ? statusCode : 'RIP'
  let message
  if (statusCode) {
    message = HTTPStatus[statusCode] || 'RIP'
  } else if (props.message) {
    message = props.message || 'An unexpected error occurred'
  } else {
    message = 'An unexpected error occurred'
  }

  return (
    <div style={styles.error}>
      <h1 className="display-2">{title}</h1>
      <h6>{message}</h6>
      <Link passHref route="index">
        <Button
          outline
          color={isDarkMode ? 'light' : 'secondary'}
          tag="a"
          className="mt-4"
        >
          Go to homepage
        </Button>
      </Link>
    </div>
  )
}

Error.defaultProps = {
  statusCode: 404,
  message: null,
}

Error.propTypes = {
  statusCode: PropTypes.number,
  message: PropTypes.string,
}

export default Error
