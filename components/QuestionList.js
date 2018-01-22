import React from 'react'
import { Table } from 'reactstrap'
import { connect } from 'react-redux'


const QuestionList = (props) => {
  let questions
  if (props.queue && props.queue.questions) {
    questions = props.queue.questions.map((questionId) => {
      const question = props.questions[questionId]
      console.log(question)
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

const mapStateToProps = (state, { queueId }) => {
  return {
    queue: state.queues.queues[queueId],
    questions: state.questions.questions,
  }
}

export default connect(mapStateToProps)(QuestionList)
