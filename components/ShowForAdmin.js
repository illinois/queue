import { connect } from 'react-redux'

import { isUserAdmin } from '../selectors'

const ShowForAdmin = ({ isAdmin, children }) => {
  if (isAdmin) {
    return children
  }
  return null
}

const mapStateToProps = state => ({
  isAdmin: isUserAdmin(state),
})

export default connect(mapStateToProps, null)(ShowForAdmin)
