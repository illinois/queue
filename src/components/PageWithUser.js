/* eslint-env browser */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import hoistStatics from 'hoist-non-react-statics'

import Error from './Error'
import { fetchCurrentUser } from '../actions/user'

import { withBaseUrl } from '../util'

const syncLogout = e => {
  if (e.key === 'logout') {
    window.location = withBaseUrl('/logout')
  }
}

export default function(AuthedComponent, permissions) {
  class PageWithUser extends React.Component {
    static async getInitialProps(ctx) {
      if (AuthedComponent.getInitialProps) {
        return AuthedComponent.getInitialProps(ctx)
      }
      return null
    }

    constructor(props) {
      super(props)
      const { user } = props
      this.state = {
        isLoading: !user,
        isAuthed: this.checkAuthz(user),
      }
    }

    componentDidMount() {
      // Time to fetch our user!
      if (!this.props.user) {
        this.props.fetchUser().then(() => {
          window.addEventListener('storage', syncLogout)
        })
      }
    }

    componentWillReceiveProps(nextProps) {
      const { user } = nextProps
      if (user) {
        this.setState({
          isLoading: false,
          isAuthed: this.checkAuthz(user),
        })
      }
    }

    componentWillUnmount() {
      window.removeEventListener('storage', syncLogout)
      window.localStorage.removeItem('logout')
    }

    checkAuthz(user) {
      if (user) {
        // Perform authz if required
        let authzed = true
        // Admins can do everything and see everything, of course
        if (permissions && !user.isAdmin) {
          const { requireAdmin, requireCourseStaff } = permissions

          if (requireAdmin && !user.isAdmin) {
            authzed = false
          } else if (requireCourseStaff) {
            // We should have received a courseId prop...
            if (!this.props.courseId) {
              console.error(
                'PageWithUser requested course staff authz, but no courseId was provided'
              )
              authzed = false
            } else if (
              user.staffAssignments.indexOf(this.props.courseId) === -1
            ) {
              authzed = false
            }
          }
        }
        return authzed
      }
      return false
    }

    render() {
      /* eslint-disable no-unused-vars */
      const { fetchUser, ...restProps } = this.props

      if (!this.state.isLoading) {
        if (this.state.isAuthed) {
          return <AuthedComponent {...restProps} />
        }

        return <Error statusCode={403} />
      }

      return null
    }
  }

  PageWithUser.defaultProps = {
    user: null,
    courseId: null,
  }

  PageWithUser.propTypes = {
    fetchUser: PropTypes.func.isRequired,
    user: PropTypes.shape({
      isAdmin: PropTypes.bool.isRequired,
    }),
    courseId: PropTypes.number,
  }

  const mapStateToProps = state => ({
    user: state.user.user,
  })

  const mapDispatchToProps = dispatch => ({
    fetchUser: () => dispatch(fetchCurrentUser()),
  })

  hoistStatics(PageWithUser, AuthedComponent)

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(PageWithUser)
}
