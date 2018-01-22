import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardBody,
  CardTitle,
  Button,
} from 'reactstrap'
import { connect } from 'react-redux'

import {
  addStaffMember,
  removeStaffMember,
} from '../actions'
import StaffMember from './StaffMember'

const StaffSidebar = (props) => {
  let staffList

  if (props.staff.length == 0) {
    staffList = (<div className="text-muted pb-2 pt-2">No on-duty staff</div>)
  } else {
    staffList = props.staff.map((staff) => {
      return (
        <StaffMember {...staff} key={staff.id} removeStaff={props.removeStaff} />
      )
    })
  }
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">On-Duty Staff</CardTitle>
        <div className="mb-3">
          {staffList}
        </div>
        <Button block color="primary" onClick={() => props.joinStaff()}>Join</Button>
      </CardBody>
    </Card>
  )
}

StaffSidebar.propTypes = {
  joinStaff: PropTypes.func.isRequired,
  removeStaff: PropTypes.func.isRequired,
}

const mapStateToProps = ({ staff }) => ({ staff: staff.staff })

const mapDispatchToProps = dispatch => ({
  joinStaff: () => dispatch(addStaffMember({ name: 'Nathan Walters', id: 6969 })),
  removeStaff: id => dispatch(removeStaffMember(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StaffSidebar)
