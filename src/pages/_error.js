import React from 'react'
import PropTypes from 'prop-types'
import HTTPStatus from 'http-status'
import { Button } from 'reactstrap'

import { Link } from '../routes'
import PageWithUser from '../components/PageWithUser'

const styles = {
  error: {
    color: '#000',
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

export class Error extends React.Component {
  static getInitialProps({ res, err }) {
    let statusCode = null
    if (res) {
      ;({ statusCode } = res)
    } else if (err) {
      ;({ statusCode } = err)
    }

    return { statusCode }
  }

  render() {
    const { statusCode } = this.props
    const title =
      statusCode === 404
        ? 'This page could not be found'
        : HTTPStatus[statusCode] || 'An unexpected error has occurred'

    return (
      <div style={styles.error}>
        <h1 className="display-2">{statusCode || 'Error!'}</h1>
        <h6>{title}.</h6>
        <Link passHref route="index">
          <Button outline color="secondary" tag="a" className="mt-4">
            Go to homepage
          </Button>
        </Link>
      </div>
    )
  }
}
Error.defaultProps = {
  statusCode: 404,
}
Error.propTypes = {
  statusCode: PropTypes.number,
}

export default PageWithUser(Error)
