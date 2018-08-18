import React from 'react'
import PropTypes from 'prop-types'

import Error from '../components/Error'
import PageWithUser from '../components/PageWithUser'

export class ErrorPage extends React.Component {
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
    return <Error statusCode={this.props.statusCode} />
  }
}

ErrorPage.defaultProps = {
  statusCode: 404,
}

ErrorPage.propTypes = {
  statusCode: PropTypes.number,
}

export default PageWithUser(ErrorPage)
