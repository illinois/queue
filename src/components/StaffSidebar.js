import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardTitle, Button } from 'reactstrap'
import { connect } from 'react-redux'
import FlipMove from 'react-flip-move'

import { addQueueStaff, removeQueueStaff, updateQueue } from '../actions/queue'
import {
  isUserCourseStaffForQueue,
  isUserActiveStaffForQueue,
  isUserAdmin,
} from '../selectors'
import StaffMember from './StaffMember'
import ConfirmLastStaffMemberLeavingModal from './ConfirmLastStaffMemberLeavingModal'

class StaffSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showLastStaffMemberLeavingModal: false,
    }
    this.confirmLastStaffMemberLeavingModal = this.confirmLastStaffMemberLeavingModal.bind(
      this
    )
    this.toggleLastStaffMemberLeavingModal = this.toggleLastStaffMemberLeavingModal.bind(
      this
    )
  }

  confirmLastStaffMemberLeavingModal() {
    const { queue } = this.props
    this.props.closeQueue(queue.id)
    this.toggleLastStaffMemberLeavingModal()
  }

  toggleLastStaffMemberLeavingModal() {
    this.setState(prevState => ({
      showLastStaffMemberLeavingModal: !prevState.showLastStaffMemberLeavingModal,
    }))
  }

  removeCurrentUser() {
    const activeStaffId = Object.values(this.props.activeStaff).find(as => {
      return this.props.activeStaff[as.id].user === this.props.user.id
    })
    if (activeStaffId) {
      const { removeStaff, queue, user } = this.props
      const activeStaffIds = queue.activeStaff
      if (activeStaffIds.length === 1 && queue.open) {
        this.toggleLastStaffMemberLeavingModal()
      }
      removeStaff(user.id, activeStaffId.id)
    }
  }

  render() {
    let staffList = null
    if (this.props.queue) {
      const { removeStaff, queue } = this.props
      const activeStaffIds = queue.activeStaff

      if (activeStaffIds && activeStaffIds.length > 0) {
        staffList = activeStaffIds.map(id => {
          const activeStaffId = id
          const user = this.props.users[this.props.activeStaff[id].user]
          return (
            <div key={user.id}>
              <StaffMember
                {...user}
                isUserCourseStaff={this.props.isUserCourseStaff}
                removeStaff={() => removeStaff(user.id, activeStaffId)}
              />
            </div>
          )
        })
      } else {
        staffList = <div className="text-muted pb-2 pt-2">No on-duty staff</div>
      }
    }

    let button = null
    if (this.props.isUserCourseStaff || this.props.isUserAdmin) {
      if (this.props.isUserActiveStaff) {
        button = (
          <div>
            <Button
              block
              color="danger"
              onClick={() => this.removeCurrentUser()}
            >
              Leave
            </Button>
          </div>
        )
      } else {
        button = (
          <Button
            block
            color="primary"
            onClick={() => this.props.joinStaff(this.props.user.id)}
          >
            Join
          </Button>
        )
      }
    }

    const containerClass = this.props.isUserCourseStaff ? 'mb-3' : null

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
          <ConfirmLastStaffMemberLeavingModal
            isOpen={this.state.showLastStaffMemberLeavingModal}
            toggle={() => this.toggleLastStaffMemberLeavingModal()}
            confirm={() => this.confirmLastStaffMemberLeavingModal()}
          />
        </CardBody>
      </Card>
    )
  }
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
      uid: PropTypes.string,
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
  closeQueue: PropTypes.func.isRequired,
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
  closeQueue: queueId =>
    dispatch(
      updateQueue(queueId, {
        open: false,
      })
    ),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaffSidebar)
