import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, CardTitle } from 'reactstrap'

import CountUpTimer from './CountUpTimer'

const ActiveQuestionPanel = ({ question }) => (
  <Fragment>
    <Card body inverse color="success">
      <CardTitle className="mb-4">
        {question.answeredBy.name} is answering your question!
      </CardTitle>
      <span>elapsed time:</span>
      <CountUpTimer startTime={question.answerStartTime} className="h1 mb-0" />
    </Card>
  </Fragment>
)

ActiveQuestionPanel.defaultProps = {
  question: {},
}

/* eslint-disable react/no-unused-prop-types */
ActiveQuestionPanel.propTypes = {
  questionId: PropTypes.number.isRequired,
  question: PropTypes.shape({
    answeredBy: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
}

const mapStateToProps = (state, ownProps) => ({
  question: state.questions.questions[ownProps.questionId],
})

export default connect(mapStateToProps, null)(ActiveQuestionPanel)
