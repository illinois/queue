import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, CardTitle, CardText, Button } from 'reactstrap'

import { deleteQuestion } from '../actions/question'

import ConfirmLeaveQueueModal from './ConfirmLeaveQueueModal'

class ActiveQuestionPanel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false,
    }

    this.toggle = this.toggle.bind(this)
    this.deleteQuestion = this.deleteQuestion.bind(this)
  }

  toggle() {
    this.setState(prevState => ({ modalOpen: !prevState.modalOpen }))
  }

  deleteQuestion() {
    this.props.deleteQuestion()
    this.setState({
      modalOpen: false,
    })
  }

  render() {
    return (
      <Fragment>
        <Card body inverse color="primary" className="mb-3">
          <CardTitle>You&apos;re on the queue!</CardTitle>
          <CardText>
            Someone from course staff will be with you shortly. In the meantime,
            keep working hard!
          </CardText>
          <Button color="light" onClick={() => this.toggle()}>
            Leave the queue
          </Button>
        </Card>
        <ConfirmLeaveQueueModal
          isOpen={this.state.modalOpen}
          toggle={this.toggle}
          confirm={this.deleteQuestion}
        />
      </Fragment>
    )
  }
}

/* eslint-disable react/no-unused-prop-types */
ActiveQuestionPanel.propTypes = {
  questionId: PropTypes.number.isRequired,
  queueId: PropTypes.number.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  question: state.questions.questions[ownProps.questionId],
})

const mapDispatchToProps = (dispatch, { queueId, questionId }) => ({
  deleteQuestion: () => dispatch(deleteQuestion(queueId, questionId)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveQuestionPanel)
