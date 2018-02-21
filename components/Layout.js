import React from 'react'
import PropTypes from 'prop-types'

import Header from './Header'

const Layout = props => (
  <div>
    <Header />
    {props.children}
    {/* This provides a bit of padding at the bottom of the page */}
    <div className="mt-3" />
  </div>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
