/* eslint-env browser */
import React from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import { config } from '@fortawesome/fontawesome-svg-core'

import HeadTitle from '../components/HeadTitle'
import makeStore from '../redux/makeStore'
import AppContainer from '../components/AppContainer'

// We add this during SSR in _document.js
config.autoAddCss = false

class MyApp extends React.Component {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
    return { pageProps }
  }

  render() {
    console.log('RENDERRRRR')
    console.log(HeadTitle)
    /* eslint-disable react/prop-types */
    const { Component, pageProps, router, store } = this.props
    return (
      <Provider store={store}>
        <HeadTitle />
        <AppContainer>
          <Component {...pageProps} key={router.route} />
        </AppContainer>
      </Provider>
    )
  }
}

export default withRedux(makeStore)(MyApp)
