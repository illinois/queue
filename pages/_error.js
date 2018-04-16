import React from 'react'
import PropTypes from 'prop-types'
import HTTPStatus from 'http-status'
import { Button } from 'reactstrap'
import withRedux from 'next-redux-wrapper'
import Layout from '../components/Layout'
import { Link } from '../routes'
import makeStore from '../redux/makeStore'
import PageWithUser from '../components/PageWithUser'

const styles = {
  error: {
    color: '#000',
    background: '#fff',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
    width: '100%',
    height: '100vh',
    position: 'absolute',
    top: '0',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  desc: {
    display: 'inline-block',
    textAlign: 'left',
    lineHeight: '49px',
    height: '49px',
    verticalAlign: 'middle',
  },

  h1: {
    display: 'inline-block',
    borderRight: '1px solid rgba(0, 0, 0,.3)',
    margin: 0,
    marginRight: '20px',
    padding: '10px 23px 10px 0',
    fontSize: '24px',
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

  navHomeButton: {
    marginTop: '24px',
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
      <Layout>
        <div style={styles.error}>
          <div>
            {statusCode ? <h1 style={styles.h1}>{statusCode}</h1> : null}
            <div style={styles.desc}>
              <h2 style={styles.h2}>{title}.</h2>
            </div>
            <div style={styles.navHomeButton}>
              <Link passHref route="index">
                <Button outline color="secondary" tag="a" size="lg" block>
                  {' '}
                  Home{' '}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
Error.defaultProps = {
  statusCode: 404,
}
Error.propTypes = {
  statusCode: PropTypes.number,
}

export default withRedux(makeStore, null, null)(PageWithUser(Error))
