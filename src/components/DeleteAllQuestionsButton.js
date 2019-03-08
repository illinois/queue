import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'

import ConfirmDeleteAllQuestionsModal from './ConfirmDeleteAllQuestionsModal'

class DeleteAllQuestionsButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showDeleteAllModal: false,
    }
  }

  confirmDeleteAllQuestionsModal() {
    const { queue } = this.props
    this.props.deleteAllQuestions(queue.id)
    this.toggleDeleteAllQuestionsModal()
  }

  toggleDeleteAllQuestionsModal() {
    this.setState(prevState => ({
      showDeleteAllModal: !prevState.showDeleteAllModal,
    }))
  }

  render() {
    const text = 'Delete All Questions'
    const color = 'danger'
    return (
      <Fragment>
        <Button
          color={color}
          block
          className="mb-3 d-flex flex-row justify-content-center align-items-center"
          style={{ whiteSpace: 'normal' }}
          onClick={() => this.toggleDeleteAllQuestionsModal()}
        >
          <span>{text}</span>
        </Button>
        <ConfirmDeleteAllQuestionsModal
          isOpen={this.state.showDeleteAllModal}
          toggle={() => this.toggleDeleteAllQuestionsModal()}
          confirm={() => this.confirmDeleteAllQuestionsModal()}
        />
      </Fragment>
    )
  }
}

DeleteAllQuestionsButton.defaultProps = {
  queue: null,
}

DeleteAllQuestionsButton.propTypes = {
  queue: PropTypes.shape({
    id: PropTypes.number,
  }),
  deleteAllQuestions: PropTypes.func.isRequired,
}

export default DeleteAllQuestionsButton
