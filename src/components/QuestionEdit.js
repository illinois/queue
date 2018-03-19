import React from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  FormFeedback,
} from 'reactstrap'

import constants from '../constants'

const fields = [
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

class QuestionEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      location: '',
      topic: '',
      isFieldValid: {},
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleModalExit = this.handleModalExit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.question) {
      this.setState({
        location: nextProps.question.location,
        topic: nextProps.question.topic,
        isFieldValid: {},
      })
    }
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleCancel() {
    this.props.onCancel()
  }

  handleSubmitEdit() {
    const isFieldValid = {}
    let valid = true

    fields.forEach(({ name, maxLength }) => {
      if (!this.state[name]) {
        isFieldValid[name] = 'This field is required!'
        valid = false
      } else if (this.state[name].length > maxLength) {
        isFieldValid[
          name
        ] = `This field has a maximum length of ${maxLength} characters`
        valid = false
      }
    })

    this.setState({
      isFieldValid,
    })
    if (!valid) return

    const attributes = {
      location: this.state.location,
      topic: this.state.topic,
    }
    this.props.onSubmitQuestionEdit(attributes)
  }

  handleModalExit() {
    this.setState({
      location: '',
      topic: '',
      isFieldValid: {},
    })
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} onClosed={this.handleModalExit}>
        <ModalHeader>Edit Question</ModalHeader>
        <ModalBody>
          <Form autoComplete="off">
            <FormGroup row>
              <Label for="location" sm={4}>
                Location
              </Label>
              <Col sm={8}>
                <Input
                  type="text"
                  name="location"
                  id="location"
                  value={this.state.location}
                  onChange={this.handleInputChange}
                  valid={isValid(this.state.isFieldValid.location)}
                />
                <FormFeedback>{this.state.isFieldValid.location}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="topic" sm={4}>
                Topic
              </Label>
              <Col sm={8}>
                <Input
                  type="text"
                  name="topic"
                  id="topic"
                  value={this.state.topic}
                  onChange={this.handleInputChange}
                  valid={isValid(this.state.isFieldValid.topic)}
                />
                <FormFeedback>{this.state.isFieldValid.topic}</FormFeedback>
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={this.handleCancel}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.handleSubmitEdit}>
            Update
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

QuestionEdit.propTypes = {
  question: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
    topic: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmitQuestionEdit: PropTypes.func.isRequired,
}

QuestionEdit.defaultProps = {
  question: null,
}

export default QuestionEdit
