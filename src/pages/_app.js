/* eslint-env browser */
import React from 'react'
import withRedux from 'next-redux-wrapper'

import makeStore from '../redux/makeStore'
import AppContainer from '../components/AppContainer'

class MyApp extends React.Component {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
    return { pageProps }
  }

  render() {
    /* eslint-disable react/prop-types */
    const { Component, pageProps, router } = this.props
    return (
      <AppContainer>
        <Component {...pageProps} key={router.route} />
      </AppContainer>
    )
  }
}

export default withRedux(makeStore)(MyApp)
