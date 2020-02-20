import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  ListGroup,
  ListGroupItem,
} from 'reactstrap'
import FlipMove from 'react-flip-move'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import AddStaff from '../AddStaff'

import RemoveableUserItem from '../RemoveableUserItem'

interface ManageStaffPanelProps {
  course: {
    id: number
    name: string
    staff: number[]
  }
  users: {
    id: number
    uid: string
    name: string
  }[]
  removeCourseStaff: (courseId: number, userId: number) => void
  addCourseStaff: (courseId: number, uid: string, name: string) => void
}

const ManageStaffPanel = ({
  course,
  users,
  removeCourseStaff,
  addCourseStaff,
}: ManageStaffPanelProps) => {
  let newUsers
  if (course.staff && course.staff.length > 0) {
    newUsers = course.staff.map(id => {
      const user = users[id]
      return (
        <RemoveableUserItem
          key={user.id}
          onRemove={(userId: number) => removeCourseStaff(course.id, userId)}
          {...user}
        />
      )
    })
  } else {
    newUsers = (
      <div>
        <ListGroupItem className="text-center text-muted pt-4 pb-4">
          This course doesn&apos;t have any staff yet
        </ListGroupItem>
      </div>
    )
  }

  return (
    <Card className="mb-3">
      <CardHeader>
        <CardTitle tag="h5" className="mb-0">
          <FontAwesomeIcon icon={faUsers} className="mr-2" /> Manage Staff
        </CardTitle>
      </CardHeader>
      <CardBody>
        <AddStaff
          onAddStaff={(staff: Record<string, string>) => {
            const { id, name } = staff
            addCourseStaff(course.id, id, name)
          }}
        />
        <ListGroup flush className="position-relative">
          <FlipMove
            enterAnimation="accordionVertical"
            leaveAnimation="accordionVertical"
            duration={200}
            typeName={null}
          >
            {newUsers}
          </FlipMove>
        </ListGroup>
      </CardBody>
    </Card>
  )
}

ManageStaffPanel.propTypes = {
  course: PropTypes.shape({
    name: PropTypes.string,
    shortcode: PropTypes.string,
    isUnlisted: PropTypes.bool,
    questionFeedback: PropTypes.bool,
  }).isRequired,
  users: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number,
      uid: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
  removeCourseStaff: PropTypes.func.isRequired,
  addCourseStaff: PropTypes.func.isRequired,
}

export default ManageStaffPanel
