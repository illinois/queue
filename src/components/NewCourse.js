import React from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  CustomInput,
  Form,
  FormGroup,
  FormFeedback,
  FormText,
  Label,
  Input,
  Button,
  ButtonGroup,
} from 'reactstrap'

const isInvalid = error => error !== undefined && error !== ''

class NewCourse extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      shortcode: '',
      isUnlisted: false,
      questionFeedback: false,
      isFieldValid: {},
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleCreateCourse = this.handleCreateCourse.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleCreateCourse()
    }
  }

  handleCreateCourse() {
    let valid = true
    const isFieldValid = {}
    ;['name', 'shortcode'].forEach(field => {
      if (!this.state[field]) {
        valid = false
        isFieldValid[field] = false
      }
    })
    if (!valid) {
      this.setState({ isFieldValid })
      return
    }

    const course = {
      name: this.state.name,
      shortcode: this.state.shortcode,
      isUnlisted: this.state.isUnlisted,
      questionFeedback: this.state.questionFeedback,
    }

    this.props.onCreateCourse(course)
  }

  render() {
    return (
      <Form autoComplete="off">
        <FormGroup row>
          <Label for="name" sm={3}>
            Name
          </Label>
          <Col sm={9}>
            <Input
              name="name"
              id="name"
              placeholder="Enter the course name (e.g. CS 225)"
              value={this.state.name}
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyPress}
              invalid={isInvalid(this.state.isFieldValid.name)}
            />
            <FormFeedback>A name is required</FormFeedback>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="name" sm={3}>
            Shortcode
          </Label>
          <Col sm={9}>
            <Input
              name="shortcode"
              id="shortcode"
              placeholder="Enter a course shortcode (e.g. cs225)"
              value={this.state.shortcode}
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyPress}
              invalid={isInvalid(this.state.isFieldValid.shortcode)}
            />
            <FormFeedback>A shortcode is required!</FormFeedback>
            <FormText>
              Adding a shortcode will allow you to generate a special link that
              will direct students to your currently open queue when they visit
              it.
            </FormText>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="name" sm={3}>
            Unlisted Course
          </Label>
          <Form>
            <Col sm={9}>
              <CustomInput
                id="isUnlisted"
                type="switch"
                name="isUnlisted"
                defaultChecked={this.state.isUnlisted}
                onChange={e => this.setState({ isUnlisted: e.target.checked })}
              />
              <FormText color="muted">
                Making your course unlisted will only allow students with the
                course shortcode to view this course.
              </FormText>
            </Col>
          </Form>
        </FormGroup>
        <FormGroup row>
          <Label for="name" sm={3}>
            Question Feedback
          </Label>
          <Form>
            <Col sm={9}>
              <CustomInput
                id="questionFeedback"
                type="switch"
                name="questionFeedback"
                defaultChecked={this.state.questionFeedback}
                onChange={e =>
                  this.setState({ questionFeedback: e.target.checked })
                }
              />
              <FormText color="muted">
                Allowing question feedback will let your course staff provide
                feedback after answering each student's question.
              </FormText>
            </Col>
          </Form>
        </FormGroup>
        <FormGroup row className="mb-0">
          <Col md={6}>
            <Button
              block
              color="secondary"
              type="button"
              onClick={() => this.props.onCancel()}
            >
              Cancel
            </Button>
          </Col>
          <Col md={6}>
            <Button
              block
              color="primary"
              type="button"
              onClick={() => this.handleCreateCourse()}
            >
              Create
            </Button>
          </Col>
        </FormGroup>
      </Form>
    )
  }
}

NewCourse.propTypes = {
  onCreateCourse: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default NewCourse
