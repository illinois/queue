/* eslint-disable react/no-danger */
import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'
import { dom } from '@fortawesome/fontawesome-svg-core'
import moment from 'moment'

import { baseUrl, isDev, isNow } from '../util'

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage()
    const styles = flush()
    return {
      html,
      head,
      errorHtml,
      chunks,
      styles,
    }
  }

  render() {
    // If we're deployed to anywhere other than the server root, we'll have to
    // store our root path that here so that the client can access it.
    const script = {
      __html: `window.BASE_URL = '${baseUrl}'; window.IS_DEV = ${isDev}; window.IS_NOW = ${isNow};`,
    }
    const faviconPath = `${baseUrl}/static/favicon.ico`
    const manifestPath = `${baseUrl}/static/manifest.json`
    const isAprilFools = moment().isBefore('2019-04-02 00:00:00.000-05')
    return (
      <html lang="en">
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
          <link rel="stylesheet" href={`${baseUrl}/_next/static/style.css`} />
          <link
            rel="manifest"
            crossOrigin="use-credentials"
            href={manifestPath}
          />
          <title>{isAprilFools ? 'Stack@Illinois' : 'Queue@Illinois'}</title>
          <style>{dom.css()}</style>
          <link rel="icon" href={faviconPath} type="image/png" />
          <script dangerouslySetInnerHTML={script} />
        </Head>
        <body className="custom_class">
          {this.props.customValue}
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
