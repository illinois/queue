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

class QuestionList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showFeedbackModal: false,
      feedbackId: null,
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
              onDeleteQuestion={this.props.deleteQuestion}
              onUpdateQuestionBeingAnswered={this.props.updateQuestionBeingAnswered}
              onFinishedAnswering={() => this.handleFinishedAnswering(questionId)}
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
