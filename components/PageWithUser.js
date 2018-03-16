import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Error from 'next/error'

import { fetchCurrentUser } from '../actions/user'
import Loading from './Loading'

export default function(AuthedComponent, permissions) {
  class PageWithUser extends React.Component {
    static async getInitialProps(ctx) {
      return AuthedComponent.getInitialProps(ctx)
    }

    constructor(props) {
      super(props)
      this.state = {
        isLoading: true,
        isAuthed: false,
      }
    }

    componentDidMount() {
      // Time to fetch our user!
      if (!this.user) {
        this.props.fetchUser()
      }
    }

    componentWillReceiveProps(nextProps) {
      const { user } = nextProps
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

        this.setState({
          isLoading: false,
          isAuthed: authzed,
        })
      }
    }

    render() {
      /* eslint-disable no-unused-vars */
      const { fetchUser, user, ...restProps } = this.props

      if (!this.state.isLoading) {
        if (this.state.isAuthed) {
          return <AuthedComponent {...restProps} />
        }

        return <Error statusCode={403} />
      }

      return <Loading />
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

  return connect(mapStateToProps, mapDispatchToProps)(PageWithUser)
}
