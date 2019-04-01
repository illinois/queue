/* eslint-env browser */
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavLink,
  NavItem,
  Button,
} from 'reactstrap'
import { connect } from 'react-redux'
import moment from 'moment'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import { Link } from '../routes'
import { withBaseUrl } from '../util'

const styles = {
  navbar: {
    zIndex: '10',
  },
}

const logoutRoute = withBaseUrl('/logout')

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
    }
  }

  toggle() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }))
  }

  render() {
    const { user } = this.props
    let userName
    if (user) {
      const { name, netid } = user
      userName = name ? `${name} (${netid})` : `${netid}`
    }

    // If there isn't a user in the store, that means the user is necessarily
    // on the login page. If that's the case, disable the link to the homepage
    // so they can't cycle repeatedly back and forth between that and the
    // login page
    let brandText
    if (moment().isAfter('2019-04-02T00:00:00-0500')) {
      brandText = 'Queue@Illinois'
    } else {
      brandText = (
        <>
          <span style={{ textDecoration: 'line-through' }}>Queue</span>
          Stack@Illinois
        </>
      )
    }
    const brandLink = user ? (
      <Link route="index" passHref>
        <NavbarBrand>{brandText}</NavbarBrand>
      </Link>
    ) : (
      <NavbarBrand tag="span">{brandText}</NavbarBrand>
    )

    return (
      <Navbar
        color="dark"
        dark
        className="mb-3 fixed-top"
        style={styles.navbar}
        expand="sm"
      >
        {brandLink}
        {user && (
          <Fragment>
            <NavbarToggler onClick={() => this.toggle()} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav navbar className="ml-auto">
                <Link route="userSettings" passHref>
                  <NavLink className="navbar-text mr-3">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    {userName}
                  </NavLink>
                </Link>
                <NavItem>
                  <Button
                    color="secondary"
                    type="button"
                    onClick={() => {
                      window.localStorage.setItem('logout', Date.now())
                      window.location = logoutRoute
                    }}
                  >
                    Logout
                  </Button>
                </NavItem>
              </Nav>
            </Collapse>
          </Fragment>
        )}
      </Navbar>
    )
  }
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

export default connect(
  mapStateToProps,
  null
)(Header)
