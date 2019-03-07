/* eslint-env browser */
import React from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import { config } from '@fortawesome/fontawesome-svg-core'

import makeStore from '../redux/makeStore'
import AppContainer from '../components/AppContainer'

import { fetchCurrentUser } from '../actions/user'

// We add this during SSR in _document.js
config.autoAddCss = false

class MyApp extends React.Component {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
    if (ctx.isServer) {
      // Fetch the current user so we can render PageWithUsers
      // Must fetch user here since getInitialProps is only called
      // server-side in pages
      await ctx.store.dispatch(fetchCurrentUser(ctx.req))
    }

    // Pass `isServer` down to all child components
    pageProps.isServer = ctx.isServer
    return { pageProps }
  }

  render() {
    /* eslint-disable react/prop-types */
    const { Component, pageProps, router, store } = this.props
    return (
      <Provider store={store}>
        <AppContainer>
          <Component {...pageProps} key={router.route} />
        </AppContainer>
      </Provider>
    )
  }
}

export default withRedux(makeStore)(MyApp)
