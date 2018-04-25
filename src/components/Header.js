import React from 'react'
import PropTypes from 'prop-types'
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavLink,
  Button,
} from 'reactstrap'
import { connect } from 'react-redux'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faUser from '@fortawesome/fontawesome-free-solid/faUser'

import { Link } from '../routes'

const styles = {
  navbar: {
    zIndex: '10',
  },
}

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }

  handleLogout() {
    window.location = 'https://edu.cs.illinois.edu/Shibboleth.sso/Logout'
  }

  render() {
    const { user } = this.props
    let userName
    if (user) {
      const { name, netid } = user
      userName = name ? `${name} (${netid})` : `${netid}`
    }
    return (
      <Navbar
        color="dark"
        dark
        className="mb-3"
        style={styles.navbar}
        expand="sm"
      >
        <Link route="index" passHref>
          <NavbarBrand>Queues@Illinois</NavbarBrand>
        </Link>
        <NavbarToggler onClick={() => this.toggle()} />
        {user && (
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar className="ml-auto">
              <div className="d-flex justify-content-between">
                <Link route="userSettings" passHref>
                  <NavLink className="navbar-text">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    {userName}
                  </NavLink>
                </Link>
                <Button
                  color="secondary"
                  type="button"
                  className="ml-3"
                  onClick={() => this.handleLogout()}
                >
                  Logout
                </Button>
              </div>
            </Nav>
          </Collapse>
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
export default connect(mapStateToProps, null)(Header)
