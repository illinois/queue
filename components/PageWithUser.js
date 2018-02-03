import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Container
} from 'reactstrap'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'

import Layout from './Layout'
import { fetchCurrentUser } from '../actions/user'

export default function (AuthedComponent) {
  class PageWithUser extends React.Component {
    static async getInitialProps(ctx) {
      return AuthedComponent.getInitialProps(ctx)
    }

    componentDidMount() {
      // Time to fetch our user!
      if (!this.user) {
        this.props.fetchUser()
      }
    }

    render() {
      const {
        // eslint-disable-next-line no-unused-vars
        fetchUser,
        user,
        ...restProps
      } = this.props

      if (user) {
        return (
          <AuthedComponent {...restProps} />
        )
      }

      return (
        <Layout>
          <Container fluid className="text-center">
            <FontAwesomeIcon icon={faSpinner} pulse size="lg" className="mt-4" />
          </Container>
        </Layout>
      )
    }
  }

  PageWithUser.propTypes = {
    fetchUser: PropTypes.func.isRequired,
  }

  const mapStateToProps = state => ({
    user: state.user.user,
  })

  const mapDispatchToProps = dispatch => ({
    fetchUser: () => dispatch(fetchCurrentUser()),
  })

  return connect(mapStateToProps, mapDispatchToProps)(PageWithUser)
}
