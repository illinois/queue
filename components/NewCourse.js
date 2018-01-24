import React from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  ListGroupItem,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Button,
} from 'reactstrap'

class NewCourse extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
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
    if (!this.state.name) {
      this.setState({
        isFieldValid: {
          name: false,
        }
      })
    } else {
      const course = {
        name: this.state.name,
      }

      this.props.onCreateCourse(course)
    }
  }

  render() {
    return (
      <ListGroupItem>
        <Form autoComplete="off">
          <FormGroup row>
            <Label for="name" sm={2}>Name</Label>
            <Col sm={10}>
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
      </ListGroupItem>
    )
  }
}

NewCourse.propTypes = {
  onCreateCourse: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default NewCourse
