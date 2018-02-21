import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  ListGroupItem,
  Button,
} from 'reactstrap'

// eslint-disable-next-line react/prefer-stateless-function
class CourseStaffMember extends React.Component {
  render() {
    const netidClasses = classNames('text-muted', 'small', { 'ml-2': this.props.name })

    return (
      <ListGroupItem className="d-flex align-items-center">
        <div>
          {this.props.name}
          <span className={netidClasses}>({this.props.netid})</span>
        </div>
        <Button
          color="danger"
          tag="div"
          className="ml-auto"
          size="sm"
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
