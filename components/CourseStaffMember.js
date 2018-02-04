import React from 'react'
import PropTypes from 'prop-types'
import {
  ListGroupItem,
  Button,
} from 'reactstrap'

// eslint-disable-next-line react/prefer-stateless-function
class CourseStaffMember extends React.Component {
  render() {
    let namePanel
    if (this.props.name) {
      namePanel = (
        <div>
          <div>{this.props.name}</div>
          <div className="text-muted text-small">{this.props.netid}</div>
        </div>
      )
    } else {
      namePanel = (
        <div>
          <div>{this.props.netid}</div>
        </div>
      )
    }

    return (
      <ListGroupItem className="d-flex align-items-center">
        {namePanel}
        <Button
          color="danger"
          tag="div"
          className="ml-auto"
          onClick={() => this.props.removeCourseStaff(this.props.id)}
        >
          Remove
        </Button>
      </ListGroupItem>
    )
  }
}

CourseStaffMember.defaultProps = {
  name: null,
}

CourseStaffMember.propTypes = {
  id: PropTypes.number.isRequired,
  netid: PropTypes.string.isRequired,
  name: PropTypes.string,
  removeCourseStaff: PropTypes.func.isRequired,
}

export default CourseStaffMember
