import React from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  Form,
  FormGroup,
  FormFeedback,
  FormText,
  Label,
  Input,
  Button,
} from 'reactstrap'

class NewCourse extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      shortcode: '',
      isFieldValid: {},
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleCreateCourse = this.handleCreateCourse.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleCreateCourse() {
    let valid = true
    const isFieldValid = {};

    ['name', 'shortcode'].forEach((field) => {
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
    }

    this.props.onCreateCourse(course)
  }

  render() {
    return (
      <Form autoComplete="off">
        <FormGroup row>
          <Label for="name" sm={3}>Name</Label>
          <Col sm={9}>
            <Input
              name="name"
              id="name"
              placeholder="Enter the course name (e.g. CS 225)"
              value={this.state.name}
              onChange={this.handleInputChange}
              valid={this.state.isFieldValid.name}
            />
            <FormFeedback>A name is required</FormFeedback>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="name" sm={3}>Shortcode</Label>
          <Col sm={9}>
            <Input
              name="shortcode"
              id="shortcode"
              placeholder="Enter a course shortcode (e.g. cs225)"
              value={this.state.shortcode}
              onChange={this.handleInputChange}
              valid={this.state.isFieldValid.shortcode}
            />
            <FormFeedback>A shortcode is required!</FormFeedback>
            <FormText>
              Adding a shortcode will allow you to generate a special link
              that will direct students to your currently open queue when they
              visit it.
            </FormText>
          </Col>
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
