import React from 'react'
import PropTypes from 'prop-types'
import {
  ListGroupItem,
} from 'reactstrap'

// eslint-disable-next-line react/prefer-stateless-function
class CourseStaffMember extends React.Component {
  render() {
    if (this.props.name) {
      return (
        <ListGroupItem>
          {this.props.name}
          <div className="text-muted text-small">{this.props.netid}</div>
        </ListGroupItem>
      )
    }

    return (
      <ListGroupItem>
        {this.props.netid}
      </ListGroupItem>
    )
  }
}

CourseStaffMember.defaultProps = {
  name: null,
}

CourseStaffMember.propTypes = {
  netid: PropTypes.string.isRequired,
  name: PropTypes.string,
}

export default CourseStaffMember
