import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { PageTransition } from 'next-page-transitions'

import Header from './Header'
import Footer from './Footer'
import Loading from './Loading'

const TIMEOUT = 200

const AppContainer = props => {
  return (
    <Fragment>
      <Header />
      <PageTransition
        timeout={TIMEOUT}
        classNames="page-transition"
        loadingComponent={<Loading />}
        loadingDelay={500}
        loadingTimeout={{
          enter: 200,
          exit: 0,
        }}
        loadingClassNames="indicator"
      >
        {props.children}
      </PageTransition>
      <Footer />
      <style global jsx>{`
        html {
          height: 100%;
        }
        body {
          min-height: 100%;
          position: relative;
          padding-top: 4.5rem;
          padding-bottom: 5rem;
        }
        .page-transition-enter {
          opacity: 0;
          transform: translate3d(0, 20px, 0);
        }
        .page-transition-enter-active {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          transition: opacity ${TIMEOUT}ms, transform ${TIMEOUT}ms;
        }
        .page-transition-exit {
          opacity: 1;
        }
        .page-transition-exit-active {
          opacity: 0;
          transition: opacity ${TIMEOUT}ms;
        }
        .indicator-appear,
        .indicator-enter {
          opacity: 0;
        }
        .indicator-appear-active,
        .indicator-enter-active {
          opacity: 1;
          transition: opacity 200ms;
        }
      `}</style>
    </Fragment>
  )
}

AppContainer.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppContainer
