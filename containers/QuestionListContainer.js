import { connect } from 'react-redux'
import {
  fetchQuestions,
  deleteQuestion,
  updateQuestionAnswering,
  updateQuestion,
  finishAnsweringQuestion,
} from '../actions/question'
import {
  isUserActiveStaffForQueue,
  isUserAnsweringQuestionForQueue,
} from '../selectors'

import QuestionList from '../components/QuestionList'

function mapStateToProps(state, props) {
  return {
    queue: state.queues.queues[props.queueId],
    questions: state.questions.questions,
    // isUserCourseStaff: isUserCourseStaff(state, queueId),
    isUserCourseStaff: isUserActiveStaffForQueue(state, props),
    isUserAnsweringQuestionForQueue: isUserAnsweringQuestionForQueue(
      state,
      props
    ),
    userId: state.user.user.id,
  }
}

const mapDispatchToProps = (dispatch, { queueId }) => ({
  fetchQuestions: () => dispatch(fetchQuestions(queueId)),
  deleteQuestion: questionId => dispatch(deleteQuestion(queueId, questionId)),
  // eslint-disable-next-line max-len
  updateQuestionBeingAnswered: (questionId, beingAnswered) =>
    dispatch(updateQuestionAnswering(questionId, beingAnswered)),
  // eslint-disable-next-line max-len
  updateQuestion: (questionId, attributes) =>
    dispatch(updateQuestion(questionId, attributes)),
  // eslint-disable-next-line max-len
  finishAnsweringQuestion: (questionId, feedback) =>
    dispatch(finishAnsweringQuestion(queueId, questionId, feedback)),
})

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList)
