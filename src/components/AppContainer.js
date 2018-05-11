import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import Fader from './Fader2'
import Header from './Header'
import Footer from './Footer'

const AppContainer = props => (
  <Fragment>
    <Header />
    <Fader timeout={10000}>{props.children}</Fader>
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
    `}</style>
  </Fragment>
)

AppContainer.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppContainer
