import React from 'react'
import PropTypes from 'prop-types'
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
} from 'reactstrap'
import { connect } from 'react-redux'

import { Link } from '../routes'

const Header = ({ user }) => {
  let userName
  if (user) {
    const { name } = user
    let { netid } = user
    if (netid.indexOf('@illinois.edu') === -1) {
      netid = `${netid}@illinois.edu`
    }
    userName = name ? `${name} (${netid})` : `${netid}`
  }
  return (
    <Navbar color="dark" dark className="mb-3">
      <Link route="index" prefetch passHref>
        <NavbarBrand>
            CS@Illinois Queues
        </NavbarBrand>
      </Link>
      <Nav navbar>
        <NavItem className="navbar-text">{userName}</NavItem>
      </Nav>
    </Navbar>
  )
}

Header.defaultProps = {
  user: null,
}

Header.propTypes = {
  user: PropTypes.shape({
    netid: PropTypes.string,
    name: PropTypes.string,
  }),
}

const mapStateToProps = ({ user }) => ({
  user: user.user,
})

export default connect(mapStateToProps, null)(Header)
