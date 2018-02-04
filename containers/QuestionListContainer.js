import { connect } from 'react-redux'
import {
  fetchQuestions,
  deleteQuestion,
  updateQuestionAnswering,
  finishAnsweringQuestion,
} from '../actions/question'

import QuestionList from '../components/QuestionList'

function isUserCourseStaff(state, queueId) {
  try {
    // Blindly assume we can walk deep into objects, and fail if we can't
    // access any required properties
    // eslint-disable-next-line prefer-destructuring
    const courseId = state.queues.queues[queueId].courseId
    return state.user.user.staffAssignments.indexOf(courseId) !== -1
  } catch (e) {
    return false
  }
}

function mapStateToProps(state, { queueId }) {
  return {
    queue: state.queues.queues[queueId],
    questions: state.questions.questions,
    isUserCourseStaff: isUserCourseStaff(state, queueId),
  }
}

const mapDispatchToProps = (dispatch, { queueId }) => ({
  fetchQuestions: () => dispatch(fetchQuestions(queueId)),
  deleteQuestion: questionId => dispatch(deleteQuestion(queueId, questionId)),
  // eslint-disable-next-line max-len
  updateQuestionBeingAnswered: (questionId, beingAnswered) => dispatch(updateQuestionAnswering(questionId, beingAnswered)),
  // eslint-disable-next-line max-len
  finishAnsweringQuestion: (questionId, feedback) => dispatch(finishAnsweringQuestion(queueId, questionId, feedback)),
})

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList)
