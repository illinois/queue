import React from 'react'
import PropTypes from 'prop-types'
import {
  ListGroup,
  ListGroupItem,
} from 'reactstrap'
import FlipMove from 'react-flip-move'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'

import Question from './Question'
import QuestionFeedback from './QuestionFeedback'
import ConfirmLeaveQueueModal from './ConfirmLeaveQueueModal'

class QuestionList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showFeedbackModal: false,
      showDeleteModal: false,
      feedbackId: null,
      deleteId: null,
    }
  }

  handleFinishedAnswering(feedbackId) {
    this.setState({
      showFeedbackModal: true,
      feedbackId,
    })
  }

  handleSubmitFeedback(feedback) {
    this.props.finishAnsweringQuestion(this.state.feedbackId, feedback).then(() => {
      this.setState({
        showFeedbackModal: false,
      })
    })
  }

  handleFeedbackCancel() {
    this.setState({
      showFeedbackModal: false,
      feedbackId: null,
    })
  }

  deleteQuestion(questionId) {
    const question = this.props.questions[questionId]
    if (this.props.userId === question.askedById) {
      // This user asked the question; confirm with them
      this.setState({
        showDeleteModal: true,
        deleteId: questionId,
      })
    } else {
      // We're probably course staff, don't confirm
      this.props.deleteQuestion(questionId)
    }
  }

  toggleDeleteModal() {
    this.setState({
      showDeleteModal: !this.state.showDeleteModal,
    })
  }

  handleConfirmedDeletion() {
    this.props.deleteQuestion(this.state.deleteId)
    this.setState({
      showDeleteModal: false,
    })
  }

  render() {
    let questions
    if (this.props.queue && this.props.queue.questions) {
      if (this.props.queue.questions.length > 0) {
        questions = this.props.queue.questions.map((questionId) => {
          const question = this.props.questions[questionId]
          return (
            <Question
              key={questionId}
              isUserCourseStaff={this.props.isUserCourseStaff}
              didUserAskQuestion={this.props.userId === question.askedById}
              deleteQuestion={() => this.deleteQuestion(questionId)}
              updateQuestionBeingAnswered={this.props.updateQuestionBeingAnswered}
              finishedAnswering={() => this.handleFinishedAnswering(questionId)}
              {...question}
            />
          )
        })
      } else {
        questions = (
          <div>
            <ListGroupItem className="text-center text-muted pt-4 pb-4">
              The queue is empty!
            </ListGroupItem>
          </div>
        )
      }
    } else {
      questions = (
        <div>
          <ListGroupItem className="text-center pt-4 pb-4">
            <FontAwesomeIcon icon={faSpinner} pulse />
          </ListGroupItem>
        </div>
      )
    }

    return (
      <div>
        <ListGroup className="mt-3">
          <FlipMove
            enterAnimation="accordionVertical"
            leaveAnimation="accordionVertical"
            duration={200}
          >
            {questions}
          </FlipMove>
        </ListGroup>
        <QuestionFeedback
          id={this.state.feedbackId}
          isOpen={this.state.showFeedbackModal}
          onSubmitFeedback={feedback => this.handleSubmitFeedback(feedback)}
          onCancel={() => this.handleFeedbackCancel()}
        />
        <ConfirmLeaveQueueModal
          isOpen={this.state.showDeleteModal}
          toggle={() => this.toggleDeleteModal()}
          confirm={() => this.handleConfirmedDeletion()}
        />
      </div>
    )
  }
}

QuestionList.propTypes = {
  queue: PropTypes.shape({
    questions: PropTypes.arrayOf(PropTypes.number),
  }),
  questions: PropTypes.objectOf(PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
    topic: PropTypes.string,
  })),
  userId: PropTypes.number.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
  updateQuestionBeingAnswered: PropTypes.func.isRequired,
  finishAnsweringQuestion: PropTypes.func.isRequired,
}

QuestionList.defaultProps = {
  queue: null,
  questions: null,
}

export default QuestionList
