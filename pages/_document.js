import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const {
      html,
      head,
      errorHtml,
      chunks,
    } = renderPage()
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
    const apiBase = (process && process.env && process.env.ASSET_PREFIX) || '/'
    const script = {
      __html: `window.API_BASE = '${apiBase}';`,
    }
    return (
      <html lang="en">
        <Head>
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
