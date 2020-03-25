/* eslint-env browser */
import React from 'react'
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
import getConfig from 'next/config'
import { connect } from 'react-redux'
import moment from 'moment'
import { useBoolean } from 'react-hanger'
import Switch from 'react-switch'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

import { Link } from '../routes'
import { withBaseUrl } from '../util'
import { useTheme } from './ThemeProvider'

const styles = {
  navbar: {
    zIndex: '10',
  },
}

const { institutionName } = getConfig().publicRuntimeConfig

const logoutRoute = withBaseUrl('/logout')

const Header = props => {
  const isOpen = useBoolean(false)
  const theme = useTheme()

  const { user } = props
  let userName
  if (user) {
    const { name, uid } = user
    userName = name ? `${name} (${uid})` : `${uid}`
  }

  // If there isn't a user in the store, that means the user is necessarily
  // on the login page. If that's the case, disable the link to the homepage
  // so they can't cycle repeatedly back and forth between that and the
  // login page
  let brandText
  if (moment().isAfter('2019-04-02T00:00:00-0500')) {
    brandText = `Queue@${institutionName}`
  } else {
    brandText = (
      <>
        <span style={{ textDecoration: 'line-through' }}>Queue</span>
        Stack@{institutionName}
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
      <NavbarToggler onClick={isOpen.toggle} />
      <Collapse isOpen={isOpen.value} navbar>
        {user && user.isAdmin && (
          <Nav navbar>
            <Link route="adminIndex" passHref>
              <NavLink>Admin</NavLink>
            </Link>
          </Nav>
        )}
        <Nav navbar className="ml-auto">
          {user && (
            <>
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
                  className="mr-3"
                  onClick={() => {
                    window.localStorage.setItem('logout', Date.now())
                    window.location = logoutRoute
                  }}
                >
                  Logout
                </Button>
              </NavItem>
            </>
          )}
          <NavItem>
            <div
              className="d-flex flex-row align-items-center"
              style={{ marginTop: '6px', marginBottom: '6px' }}
            >
              <Switch
                onChange={checked => theme.setIsDarkMode(checked)}
                checked={theme.isDarkMode}
                handleDiameter={16}
                height={28}
                offColor="#6c757d"
                onColor="#375a7f"
                offHandleColor="#fff"
                onHandleColor="#fff"
                checkedIcon={
                  <FontAwesomeIcon
                    icon={faMoon}
                    color="white"
                    style={{
                      padding: '6px',
                      paddingLeft: '0px',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                }
                uncheckedIcon={
                  <FontAwesomeIcon
                    icon={faSun}
                    color="white"
                    style={{
                      padding: '6px',
                      paddingRight: '0px',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                }
              />
            </div>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  )
}

Header.defaultProps = {
  user: null,
}

Header.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
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
