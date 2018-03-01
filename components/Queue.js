import React from 'react'
import PropTypes from 'prop-types'
import { ListGroupItem, Button } from 'reactstrap'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faMapMarker from '@fortawesome/fontawesome-free-solid/faMapMarker'
import faQuestion from '@fortawesome/fontawesome-free-solid/faQuestionCircle'

import { Link } from '../routes'

class Queue extends React.Component {
  deleteQueue(e) {
    // Needed to prevent click from propagating to parent element
    e.stopPropagation()
    e.preventDefault()
    this.props.onDeleteQueue(this.props.id)
  }

  render() {
    const { id, name, location, isUserCourseStaff, questionCount } = this.props

    // When we first create a queue, there's no question count in the response
    // We'll just assume it's 0 until a page reload or websocket event
    const adjustedCount = questionCount || 0
    const questionCountText = `${adjustedCount} Question${
      adjustedCount !== 1 ? 's' : ''
    }`
    const locationText = location || 'No location specified'

    return (
      <Link route="queue" params={{ id }} prefetch passHref>
        <ListGroupItem action tag="a" className="d-flex align-items-center">
          <div>
            <div className="h5">{name}</div>
            <div className="text-muted">
              <FontAwesomeIcon icon={faMapMarker} fixedWidth className="mr-2" />
              {locationText}
              <br />
              <FontAwesomeIcon icon={faQuestion} fixedWidth className="mr-2" />
              {questionCountText}
            </div>
          </div>
          {isUserCourseStaff && (
            <Button
              color="danger"
              tag="div"
              outline
              size="sm"
              className="ml-auto"
              onClick={e => this.deleteQueue(e)}
            >
              Delete
            </Button>
          )}
        </ListGroupItem>
      </Link>
    )
  }
}

Queue.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  questionCount: PropTypes.number.isRequired,
  onDeleteQueue: PropTypes.func.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
}

export default Queue
