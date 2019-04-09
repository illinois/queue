/* eslint-disable prefer-destructuring */
import React from 'react'
import PropTypes from 'prop-types'

import Error from '../components/Error'
import PageWithUser from '../components/PageWithUser'

export class ErrorPage extends React.Component {
  static getInitialProps({ res, err }) {
    let statusCode = null
    let message = null
    if (res) {
      statusCode = res.statusCode
    } else if (err) {
      if (err.statusCode) {
        statusCode = err.statusCode
      } else {
        message = err.message
      }
    }

    return { statusCode, message }
  }

  render() {
    const { statusCode, message } = this.props
    return <Error statusCode={statusCode} message={message} />
  }
}

ErrorPage.defaultProps = {
  statusCode: null,
  message: null,
}

ErrorPage.propTypes = {
  statusCode: PropTypes.number,
  message: PropTypes.string,
}

export default PageWithUser(ErrorPage)
