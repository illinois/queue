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
    netid: string
    name: string
  }[]
  removeCourseStaff: (courseId: number, userId: number) => void
  addCourseStaff: (courseId: number, netid: string, name: string) => void
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
      <ListGroupItem className="text-center text-muted pt-4 pb-4">
        This course doesn&apos;t have any staff yet
      </ListGroupItem>
    )
  }

  return (
    <Card className="mb-3">
      <CardHeader>
        <CardTitle tag="h5" className="mb-0">
          Manage {course && course.name} Staff
        </CardTitle>
      </CardHeader>
      <CardBody>
        <ListGroup flush className="position-relative">
          <AddStaff
            onAddStaff={(staff: Record<string, string>) => {
              const { netid, name } = staff
              addCourseStaff(course.id, netid, name)
            }}
          />
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
      netid: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
  removeCourseStaff: PropTypes.func.isRequired,
  addCourseStaff: PropTypes.func.isRequired,
}

export default ManageStaffPanel
