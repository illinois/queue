import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardTitle, Button } from 'reactstrap'
import { connect } from 'react-redux'
import FlipMove from 'react-flip-move'

import { addQueueStaff, removeQueueStaff } from '../actions/queue'
import {
  isUserCourseStaffForQueue,
  isUserActiveStaffForQueue,
  isUserAdmin,
} from '../selectors'
import StaffMember from './StaffMember'

const StaffSidebar = props => {
  let staffList = null

  if (props.queue) {
    const { removeStaff, queue } = props
    const activeStaffIds = queue.activeStaff
    if (activeStaffIds && activeStaffIds.length > 0) {
      staffList = activeStaffIds.map(id => {
        const activeStaffId = id
        const user = props.users[props.activeStaff[id].user]
        return (
          <div key={user.id}>
            <StaffMember
              {...user}
              isUserCourseStaff={props.isUserCourseStaff}
              removeStaff={() => removeStaff(user.id, activeStaffId)}
            />
          </div>
        )
      })
    } else {
      staffList = <div className="text-muted pb-2 pt-2">No on-duty staff</div>
    }
  }

  function removeCurrentUser() {
    const activeStaffId = Object.values(props.activeStaff).find(as => {
      return props.activeStaff[as.id].user === props.user.id
    })
    if (activeStaffId) {
      props.removeStaff(props.user.id, activeStaffId.id)
    }
  }

  let button = null
  if (props.isUserCourseStaff || props.isUserAdmin) {
    if (props.isUserActiveStaff) {
      button = (
        <Button block color="danger" onClick={() => removeCurrentUser()}>
          Leave
        </Button>
      )
    } else {
      button = (
        <Button
          block
          color="primary"
          onClick={() => props.joinStaff(props.user.id)}
        >
          Join
        </Button>
      )
    }
  }

  const containerClass = props.isUserCourseStaff ? 'mb-3' : null

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">On-Duty Staff</CardTitle>
        <div className={containerClass}>
          <FlipMove
            enterAnimation="accordionVertical"
            leaveAnimation="accordionVertical"
            duration={200}
          >
            {staffList}
          </FlipMove>
        </div>
        {button}
      </CardBody>
    </Card>
  )
}

StaffSidebar.defaultProps = {
  user: null,
  queue: null,
  users: {},
  activeStaff: {},
  isUserCourseStaff: false,
  isUserActiveStaff: false,
  isUserAdmin: false,
}

StaffSidebar.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  queueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  queue: PropTypes.shape({
    activeStaff: PropTypes.arrayOf(PropTypes.number),
  }),
  users: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number,
      netid: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  activeStaff: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number,
      user: PropTypes.number,
    })
  ),
  joinStaff: PropTypes.func.isRequired,
  removeStaff: PropTypes.func.isRequired,
  isUserCourseStaff: PropTypes.bool,
  isUserActiveStaff: PropTypes.bool,
  isUserAdmin: PropTypes.bool,
}

const mapStateToProps = (state, props) => ({
  user: state.user.user,
  users: state.users.users,
  activeStaff: state.activeStaff.activeStaff,
  queue: state.queues.queues[props.queueId],
  isUserCourseStaff: isUserCourseStaffForQueue(state, props),
  isUserActiveStaff: isUserActiveStaffForQueue(state, props),
  isUserAdmin: isUserAdmin(state),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  joinStaff: (...args) => dispatch(addQueueStaff(ownProps.queueId, ...args)),
  removeStaff: (...args) =>
    dispatch(removeQueueStaff(ownProps.queueId, ...args)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaffSidebar)
