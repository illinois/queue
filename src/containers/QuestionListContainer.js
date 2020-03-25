import { connect } from 'react-redux'
import {
  fetchQuestions,
  deleteQuestion,
  updateQuestionAnswering,
  updateQuestion,
  finishAnsweringQuestion,
} from '../actions/question'
import {
  isUserCourseStaffForQueue,
  isUserActiveStaffForQueue,
  isUserAnsweringQuestionForQueue,
  isUserAdmin,
} from '../selectors'

import QuestionList from '../components/QuestionList'

const mapStateToProps = (state, props) => ({
  queue: state.queues.queues[props.queueId],
  questions: state.questions.questions,
  isUserCourseStaff: isUserCourseStaffForQueue(state, props),
  isUserActiveStaffForQueue: isUserActiveStaffForQueue(state, props),
  isUserAnsweringQuestionForQueue: isUserAnsweringQuestionForQueue(
    state,
    props
  ),
  isUserAdmin: isUserAdmin(state, props),
  userId: state.user.user.id,
  course: state.courses.courses[state.queues.queues[props.queueId].courseId],
})

const mapDispatchToProps = (dispatch, { queueId }) => ({
  fetchQuestions: () => dispatch(fetchQuestions(queueId)),
  deleteQuestion: questionId => dispatch(deleteQuestion(queueId, questionId)),
  updateQuestionBeingAnswered: (questionId, beingAnswered) =>
    dispatch(updateQuestionAnswering(questionId, beingAnswered)),
  updateQuestion: (questionId, attributes) =>
    dispatch(updateQuestion(questionId, attributes)),
  finishAnsweringQuestion: (questionId, feedback) =>
    dispatch(finishAnsweringQuestion(queueId, questionId, feedback)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionList)
