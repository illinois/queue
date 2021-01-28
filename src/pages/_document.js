/* eslint-disable react/no-danger */
import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'
import nextCookies from 'next-cookies'

export default class MyDocument extends Document {
  static getInitialProps(ctx) {
    const { html, head, errorHtml, chunks } = ctx.renderPage()
    // This cookie is set on the client; we read it here to know if we should
    // render the body with the 'darkmode' class on the server to avoid a flash
    // of white background if darkmode is enabled
    const { darkmode } = nextCookies(ctx)
    const isDarkMode = darkmode === 'true'
    const styles = flush()
    return {
      html,
      head,
      errorHtml,
      chunks,
      styles,
      isDarkMode,
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body className={this.props.isDarkMode ? 'darkmode' : null}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
