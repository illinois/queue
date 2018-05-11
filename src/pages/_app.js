/* eslint-env browser */
import React, { Fragment } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import withRedux from 'next-redux-wrapper'

import makeStore from '../redux/makeStore'
import Layout from '../components/Layout'

class MyApp extends React.Component {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
    return { pageProps }
  }

  render() {
    /* eslint-disable react/prop-types */
    const { Component, pageProps } = this.props
    return (
      <Fragment>
        <Layout>
          <div className="position-relative">
            <TransitionGroup component={null}>
              <CSSTransition
                key={this.props.router.route}
                classNames="absolute-child fade"
                in
                appear
                timeout={500}
                onEnter={() => window.scrollTo(0, 0)}
              >
                <div>
                  <Component {...pageProps} />
                </div>
              </CSSTransition>
            </TransitionGroup>
          </div>
        </Layout>
        <style jsx global>{`
          .absolute-child {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
          .fade-appear,
          .fade-enter {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          .fade-appear-active,
          .fade-enter-active {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            transition: opacity 250ms, transform 250ms;
            transition-delay: 250ms;
          }
          .fade-exit-active {
            opacity: 0;
            transition: opacity 250ms;
          }
        `}</style>
      </Fragment>
    )
  }
}

export default withRedux(makeStore)(MyApp)
