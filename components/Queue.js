import React from 'react'
import PropTypes from 'prop-types'
import {
  ListGroupItem,
  Button,
} from 'reactstrap'
import { Link } from '../routes'

class Queue extends React.Component {
  deleteQueue(e) {
    e.stopPropagation()
    e.preventDefault()
    this.props.onDeleteQueue(this.props.id)
  }

  render() {
    const {
      id,
      name,
      location,
      isUserCourseStaff,
    } = this.props

    return (
      <Link route="queue" params={{ id }} passHref>
        <ListGroupItem action tag="a" className="d-flex align-items-center">
          <div>
            <div className="h5">{name}</div>
            <div className="text-muted">Location: {location}</div>
          </div>
          {isUserCourseStaff &&
            <Button
              color="danger"
              tag="div"
              className="ml-auto"
              onClick={e => this.deleteQueue(e)}
            >
              Delete
            </Button>
          }
        </ListGroupItem>
      </Link>
    )
  }
}

Queue.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  onDeleteQueue: PropTypes.func.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
}

export default Queue
