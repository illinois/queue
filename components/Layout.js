import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import Header from './Header'
import Footer from './Footer'

const Layout = props => (
  <Fragment>
    <Header />
    {props.children}
    {/* This provides a bit of padding at the bottom of the page */}
    <Footer />
    <style global jsx>{`
      html {
        height: 100%;
      }
      body {
        min-height: 100%;
        position: relative;
        padding-bottom: 5rem;
      }
    `}</style>
  </Fragment>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
