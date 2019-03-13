import React from 'react'
import PropTypes from 'prop-types'
import { ListGroup, ListGroupItem } from 'reactstrap'
import FlipMove from 'react-flip-move'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import Question from './Question'
import QuestionFeedback from './QuestionFeedback'
import ConfirmLeaveQueueModal from './ConfirmLeaveQueueModal'
import ConfirmDeleteQuestionModal from './ConfirmDeleteQuestionModal'
import ConfirmCancelQuestionModal from './ConfirmCancelQuestionModal'
import ConfirmStopAnsweringQuestionModal from './ConfirmStopAnsweringQuestionModal'
import QuestionEdit from './QuestionEdit'

class QuestionList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showFeedbackModal: false,
      showLeaveModal: false,
      showDeleteModal: false,
      showCancelModal: false,
      showStopAnswerModal: false,
      showQuestionEditModal: false,
      attributeId: null,
      feedbackId: null,
      deleteId: null,
      cancelId: null,
    }
  }

  handleFinishedAnswering(feedbackId) {
    this.setState({
      showFeedbackModal: true,
      feedbackId,
    })
  }

  handleSubmitFeedback(feedback) {
    this.props
      .finishAnsweringQuestion(this.state.feedbackId, feedback)
      .then(() => {
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

  handleEditQuestion(attributeId) {
    this.setState({
      showQuestionEditModal: true,
      attributeId,
    })
  }

  handleSubmitQuestionEdit(attributes) {
    this.props.updateQuestion(this.state.attributeId, attributes).then(() => {
      this.setState({
        showQuestionEditModal: false,
      })
    })
  }

  handleQuestionEditCancel() {
    this.setState({
      showQuestionEditModal: false,
      attributeId: null,
    })
  }

  deleteQuestion(questionId) {
    const question = this.props.questions[questionId]
    if (this.props.userId === question.askedById) {
      // This user asked the question; confirm with them
      this.setState({
        showLeaveModal: true,
        deleteId: questionId,
      })
    } else {
      // We're probably course staff
      this.setState({
        showDeleteModal: true,
        deleteId: questionId,
      })
    }
  }

  toggleLeaveModal() {
    this.setState(prevState => ({ showLeaveModal: !prevState.showLeaveModal }))
  }

  toggleDeleteModal() {
    this.setState(prevState => ({
      showDeleteModal: !prevState.showDeleteModal,
    }))
  }

  handleConfirmedDeletion() {
    this.props.deleteQuestion(this.state.deleteId)
    this.setState({
      showDeleteModal: false,
      showLeaveModal: false,
    })
  }

  toggleCancelModal() {
    this.setState(prevState => ({
      showCancelModal: !prevState.showCancelModal,
    }))
  }

  toggleStopAnswerModal() {
    this.setState(prevState => ({
      showStopAnswerModal: !prevState.showStopAnswerModal,
    }))
  }

  cancelQuestion(questionId) {
    const question = this.props.questions[questionId]
    if (this.props.userId === question.answeredById) {
      this.setState({
        showStopAnswerModal: true,
        cancelId: questionId,
      })
    } else {
      this.setState({
        showCancelModal: true,
        cancelId: questionId,
      })
    }
  }

  startQuestion(questionId) {
    this.props.updateQuestionBeingAnswered(questionId, true)
  }

  handleConfirmedCancellation() {
    this.props.updateQuestionBeingAnswered(this.state.cancelId, false)
    this.setState({
      showCancelModal: false,
      showStopAnswerModal: false,
    })
  }

  render() {
    const { queue, userId } = this.props
    let questions
    if (queue && queue.questions) {
      if (queue.questions.length > 0) {
        questions = queue.questions.map(questionId => {
          const question = this.props.questions[questionId]
          if (
            !queue.isConfidential ||
            (userId === question.askedById ||
              this.props.isUserCourseStaff ||
              this.props.isUserAdmin)
          ) {
            return (
              <Question
                key={questionId}
                isConfidential={queue.isConfidential}
                isUserCourseStaff={this.props.isUserCourseStaff}
                isUserActiveStaffForQueue={this.props.isUserActiveStaffForQueue}
                isUserAnsweringQuestion={userId === question.answeredById}
                isUserAnsweringOtherQuestion={
                  this.props.isUserAnsweringQuestionForQueue
                }
                didUserAskQuestion={userId === question.askedById}
                deleteQuestion={() => this.deleteQuestion(questionId)}
                cancelQuestion={() => this.cancelQuestion(questionId)}
                startQuestion={() => this.startQuestion(questionId)}
                finishedAnswering={() =>
                  this.handleFinishedAnswering(questionId)
                }
                editQuestion={() => this.handleEditQuestion(questionId)}
                {...question}
              />
            )
          }
          return null
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
        <ListGroup>
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
          isOpen={this.state.showLeaveModal}
          toggle={() => this.toggleLeaveModal()}
          confirm={() => this.handleConfirmedDeletion()}
        />
        <ConfirmDeleteQuestionModal
          isOpen={this.state.showDeleteModal}
          toggle={() => this.toggleDeleteModal()}
          confirm={() => this.handleConfirmedDeletion()}
        />
        <ConfirmCancelQuestionModal
          isOpen={this.state.showCancelModal}
          toggle={() => this.toggleCancelModal()}
          confirm={() => this.handleConfirmedCancellation()}
        />
        <ConfirmStopAnsweringQuestionModal
          isOpen={this.state.showStopAnswerModal}
          toggle={() => this.toggleStopAnswerModal()}
          confirm={() => this.handleConfirmedCancellation()}
        />
        <QuestionEdit
          question={this.props.questions[this.state.attributeId]}
          queue={queue}
          isOpen={this.state.showQuestionEditModal}
          onSubmitQuestionEdit={attributes =>
            this.handleSubmitQuestionEdit(attributes)
          }
          onCancel={() => this.handleQuestionEditCancel()}
        />
      </div>
    )
  }
}

QuestionList.propTypes = {
  queue: PropTypes.shape({
    questions: PropTypes.arrayOf(PropTypes.number),
    fixedLocation: PropTypes.bool,
    isConfidential: PropTypes.bool,
  }),
  questions: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string,
      location: PropTypes.string,
      topic: PropTypes.string,
    })
  ),
  userId: PropTypes.number.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
  isUserActiveStaffForQueue: PropTypes.bool.isRequired,
  isUserAnsweringQuestionForQueue: PropTypes.bool.isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
  updateQuestionBeingAnswered: PropTypes.func.isRequired,
  finishAnsweringQuestion: PropTypes.func.isRequired,
  updateQuestion: PropTypes.func.isRequired,
}

QuestionList.defaultProps = {
  queue: null,
  questions: null,
}

export default QuestionList
