import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  FormFeedback,
} from 'reactstrap'

export default class NewQuestion extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      topic: '',
      location: '',
      isFieldValid: {},
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit() {
    const isFieldValid = {}
    let valid = true;
    ['name', 'topic', 'location'].forEach((field) => {
      if (!this.state[field]) {
        isFieldValid[field] = false
        valid = false
      }
    })
    this.setState({
      isFieldValid,
    })
    if (!valid) return
    const question = {
      name: this.state.name,
      location: this.state.location,
      topic: this.state.topic,
    }
    this.props.createQuestion(this.props.queueId, question)
  }

  render() {
    return (
      <Card color="light">
        <CardHeader sm={2}>New question</CardHeader>
        <CardBody>
          <Form onSubmit={this.handleSubmit} autoComplete="off">
            <FormGroup row>
              <Label for="name" sm={2}>Name</Label>
              <Col sm={10}>
                <Input
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                  valid={this.state.isFieldValid.name}
                />
                <FormFeedback>A name is required</FormFeedback>
                <FormText color="muted">
                  Using a nickname is fine!
                </FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="topic" sm={2}>Topic</Label>
              <Col sm={10}>
                <Input
                  name="topic"
                  id="topic"
                  placeholder="Enter a brief topic for your question"
                  value={this.state.topic}
                  onChange={this.handleInputChange}
                  valid={this.state.isFieldValid.topic}
                />
                <FormFeedback>A topic is required</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="location" sm={2}>Location</Label>
              <Col sm={10}>
                <Input
                  name="location"
                  id="location"
                  placeholder="Enter your location"
                  value={this.state.location}
                  onChange={this.handleInputChange}
                  valid={this.state.isFieldValid.location}
                />
                <FormFeedback>A location is required</FormFeedback>
              </Col>
            </FormGroup>
            <Button
              block
              color="primary"
              type="button"
              onClick={this.handleSubmit}
            >
              Add to queue
            </Button>
          </Form>
        </CardBody>
      </Card>
    )
  }
}

NewQuestion.propTypes = {
  createQuestion: PropTypes.func.isRequired,
  queueId: PropTypes.string.isRequired,
}
