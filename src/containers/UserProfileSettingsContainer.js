import { connect } from 'react-redux'

import { updateUserPreferredName } from '../actions/user'

import UserProfileSettings from '../components/UserProfileSettings'

const mapStateToProps = state => ({
  user: state.user.user,
})

const mapDispatchToProps = dispatch => ({
  updateUserPreferredName: name => dispatch(updateUserPreferredName(name)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfileSettings)
