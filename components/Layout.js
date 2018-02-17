import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

import Header from './Header'

const Layout = props => (
   <div>
      <Header />
      {props.children}
   </div>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
