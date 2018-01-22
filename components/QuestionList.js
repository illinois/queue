import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'reactstrap'
import { connect } from 'react-redux'


const QuestionList = (props) => {
  let questions
  if (props.queue && props.queue.questions) {
    questions = props.queue.questions.map((questionId) => {
      const question = props.questions[questionId]
      return (
        <tr key={question.id}>
          <td>{question.name}</td>
          <td>{question.location}</td>
          <td>{question.topic}</td>
        </tr>
      )
    })
  }
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>Topic</th>
        </tr>
      </thead>
      <tbody>
        {questions}
      </tbody>
    </Table>
  )
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
}

QuestionList.defaultProps = {
  queue: null,
  questions: null,
}

const mapStateToProps = (state, { queueId }) => ({
  queue: state.queues.queues[queueId],
  questions: state.questions.questions,
})

export default connect(mapStateToProps)(QuestionList)
