import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import FontAwesome from '@fortawesome/fontawesome'

import Header from './Header'

const Layout = props => (
  <div>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/css/bootstrap.min.css" integrity="sha384-Zug+QiDoJOrZ5t4lssLdxGhVrurbmBWopoEl+M6BdEfwnCJZtKxi1KgxUyJq13dy" crossOrigin="anonymous" />
      {/* <script defer src="https://use.fontawesome.com/releases/v5.0.4/js/all.js"></script> */}
      <style>{FontAwesome.dom.css()}</style>
    </Head>

    <div>
      <Header />
      {props.children}
    </div>
  </div>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
