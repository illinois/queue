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

import constants from '../constants'

const fields = [
  {
    name: 'name',
    maxLength: constants.QUESTION_NAME_MAX_LENGTH,
  },
  {
    name: 'topic',
    maxLength: constants.QUESTION_TOPIC_MAX_LENGTH,
  },
  {
    name: 'location',
    maxLength: constants.QUESTION_LOCATION_MAX_LENGTH,
  },
]

const isValid = error => (error === undefined ? undefined : error === '')

export default class NewQuestion extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: props.user.name || '',
      topic: '',
      location: '',
      fieldErrors: {},
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
    const fieldErrors = {}
    let valid = true

    fields.forEach(({ name, maxLength }) => {
      if (!this.state[name]) {
        fieldErrors[name] = 'This field is required!'
        valid = false
      } else if (this.state[name].length > maxLength) {
        fieldErrors[
          name
        ] = `This field has a maximum length of ${maxLength} characters`
        valid = false
      }
    })

    this.setState({
      fieldErrors,
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
      <Card color="light" className="mb-3">
        <CardHeader sm={2}>New question</CardHeader>
        <CardBody>
          <Form onSubmit={this.handleSubmit} autoComplete="off">
            <FormGroup row>
              <Label for="name" sm={2}>
                Name
              </Label>
              <Col sm={10}>
                <Input
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                  valid={isValid(this.state.fieldErrors.name)}
                />
                <FormFeedback>{this.state.fieldErrors.name}</FormFeedback>
                <FormText color="muted">Using a nickname is fine!</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="topic" sm={2}>
                Topic
              </Label>
              <Col sm={10}>
                <Input
                  name="topic"
                  id="topic"
                  placeholder="Enter a brief topic for your question"
                  value={this.state.topic}
                  onChange={this.handleInputChange}
                  valid={isValid(this.state.fieldErrors.topic)}
                />
                <FormFeedback>{this.state.fieldErrors.topic}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="location" sm={2}>
                Location
              </Label>
              <Col sm={10}>
                <Input
                  name="location"
                  id="location"
                  placeholder="Enter your location (eg. Basement Tables or 0224)"
                  value={this.state.location}
                  onChange={this.handleInputChange}
                  valid={isValid(this.state.fieldErrors.location)}
                />
                <FormFeedback>{this.state.fieldErrors.location}</FormFeedback>
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
  queueId: PropTypes.number.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  createQuestion: PropTypes.func.isRequired,
}
