/* eslint-env browser */
import React from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import { dom, config } from '@fortawesome/fontawesome-svg-core'
import nextCookies from 'next-cookies'
import Head from 'next/head'
import getConfig from 'next/config'
import moment from 'moment'

import makeStore from '../redux/makeStore'
import AppContainer from '../components/AppContainer'
import { ThemeProvider } from '../components/ThemeProvider'

import { baseUrl, isDev, isNow } from '../util'

const { institutionName } = getConfig().publicRuntimeConfig

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
    // If we're deployed to anywhere other than the server root, we'll have to
    // store our root path that here so that the client can access it.
    const script = {
      __html: `window.BASE_URL = '${baseUrl}'; window.IS_DEV = ${isDev}; window.IS_NOW = ${isNow};`,
    }
    const faviconPath = `${baseUrl}/static/favicon.ico`
    const manifestPath = `${baseUrl}/static/manifest.json`
    const isAprilFools = moment().isBefore('2019-04-02 00:00:00.000-05')
    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
            integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
            crossOrigin="anonymous"
          />
          <link
            rel="manifest"
            crossOrigin="use-credentials"
            href={manifestPath}
          />
          <title>
            {isAprilFools
              ? `Stack@${institutionName}`
              : `Queue@${institutionName}`}
          </title>
          <style>{dom.css()}</style>
          <link rel="icon" href={faviconPath} type="image/png" />
          <script dangerouslySetInnerHTML={script} />
        </Head>
        <Provider store={store}>
          <ThemeProvider isDarkMode={isDarkMode}>
            <AppContainer>
              <Component {...pageProps} key={router.route} />
            </AppContainer>
          </ThemeProvider>
        </Provider>
      </>
    )
  }
}

export default withRedux(makeStore)(MyApp)
