import React from 'react'
import fetch from 'isomorphic-unfetch'

export default class QuestionList extends React.Component {
  componentDidMount() {
    this.props.fetchQuestions(this.props.queueId)
  }

  render() {
    console.log(this.props)
    const items = (this.props.questions || []).map(question => (
      <div key={question._id}>{question.pseudonym}</div>
    ))
    return (
      <div>
        {items}
      </div>
    )
  }
}
