import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import Header from './Header'

const Layout = props => (
  <Fragment>
    <Header />
    {props.children}
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

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
