import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'

class DeleteAllQuestionsToggle extends React.Component {
  toggleDeleteAllQuestions() {
    const attributes = {
      open: !this.props.queue.open,
    }
    this.props.deleteAllQuestions(this.props.queue.id)
  }

  render() {
    const text = this.props.queue.open ? 'Delete All Questions' : 'All Deleted!'
    const color = this.props.queue.open ? 'danger' : 'success'

    return (
      <Button
        color={color}
        block
        className="mb-3 d-flex flex-row justify-content-center align-items-center"
        style={{ whiteSpace: 'normal' }}
        onClick={() => this.toggleDeleteAllQuestions()}
      >
        <span>{text}</span>
      </Button>
    )
  }
}

DeleteAllQuestionsToggle.defaultProps = {
  queue: null,
}

DeleteAllQuestionsToggle.propTypes = {
  queue: PropTypes.shape({
    id: PropTypes.number,
    open: PropTypes.bool,
  }),
  deleteAllQuestions: PropTypes.func.isRequired,
}

export default DeleteAllQuestionsToggle
