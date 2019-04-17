/* eslint-env browser */
import React from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import { config } from '@fortawesome/fontawesome-svg-core'
import nextCookies from 'next-cookies'

import makeStore from '../redux/makeStore'
import AppContainer from '../components/AppContainer'
import { ThemeProvider } from '../components/ThemeProvider'

// We add this during SSR in _document.js
config.autoAddCss = false

class MyApp extends React.Component {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
    // We need to figure out if we're in darkmode so we can render the switch
    // in the correct state on the server.
    const { darkmode } = nextCookies(ctx)
    const isDarkMode = darkmode === 'true'
    return { pageProps, isDarkMode }
  }

  render() {
    /* eslint-disable react/prop-types */
    const { Component, pageProps, router, store, isDarkMode } = this.props
    return (
      <Provider store={store}>
        <ThemeProvider isDarkMode={isDarkMode}>
          <AppContainer>
            <Component {...pageProps} key={router.route} />
          </AppContainer>
        </ThemeProvider>
      </Provider>
    )
  }
}

export default withRedux(makeStore)(MyApp)
