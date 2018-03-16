import React from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Label,
  Input,
  Button,
} from 'reactstrap'
import Toggle from 'react-toggle'
import 'react-toggle/style.css'
import { connect } from 'react-redux'

import { mapObjectToArray } from '../util'

const isValid = error => (error === undefined ? undefined : error === '')

class NewQueue extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      course: 'none',
      name: '',
      location: '',
      fixedLocation: false,
      fieldErrors: {},
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(event) {
    if (event.target.type === 'checkbox') {
      this.setState({
        [event.target.name]: event.target.checked,
      })
    } else {
      this.setState({
        [event.target.name]: event.target.value,
      })
    }
  }

  handleSubmit() {
    let valid = true
    const fieldErrors = {}

    // Only validate the course if the course selector is shown
    if (this.props.showCourseSelector && this.state.course === 'none') {
      valid = false
      fieldErrors.course = 'You must select a course'
    }

    if (!this.state.name) {
      valid = false
      fieldErrors.name = 'You must name this queue'
    }

    if (this.state.fixedLocation && !this.state.location) {
      valid = false
      fieldErrors.location =
        'You must set a location for a fixed-location queue'
    }

    if (!valid) {
      this.setState({ fieldErrors })
      return
    }

    const queue = {
      name: this.state.name,
      location: this.state.location,
    }

    let courseId
    if (this.state.course) {
      courseId = Number.parseInt(this.state.course, 10)
    }

    this.props.onCreateQueue(queue, courseId)
  }

  render() {
    const { courses, user, showCourseSelector } = this.props
    let courseOptions
    if (showCourseSelector) {
      let userCourses = courses
      if (!user.isAdmin) {
        userCourses = courses.filter(
          c => user.staffAssignments.indexOf(c.id) !== -1
        )
      }
      courseOptions = userCourses.map(course => (
        <option value={course.id} key={course.id}>
          {course.name}
        </option>
      ))
    }

    return (
      <Form autoComplete="off">
        {showCourseSelector && (
          <FormGroup row>
            <Label for="course" sm={3}>
              Course
            </Label>
            <Col sm={9}>
              <Input
                type="select"
                name="course"
                id="course"
                onChange={this.handleInputChange}
                value={this.state.course}
                valid={isValid(this.state.fieldErrors.course)}
              >
                <option value="none" disabled>
                  Select a course
                </option>
                {courseOptions}
              </Input>
              <FormFeedback>{this.state.fieldErrors.course}</FormFeedback>
            </Col>
          </FormGroup>
        )}
        <FormGroup row>
          <Label for="name" sm={3}>
            Name
          </Label>
          <Col sm={9}>
            <Input
              type="text"
              name="name"
              placeholder="Office Hours"
              onChange={this.handleInputChange}
              value={this.state.name}
              valid={isValid(this.state.fieldErrors.name)}
            />
            <FormFeedback>{this.state.fieldErrors.name}</FormFeedback>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="fixedLocation" sm={3}>
            Fixed location
          </Label>
          <Col sm={9}>
            <Toggle
              name="fixedLocation"
              defaultChecked={false}
              onChange={this.handleInputChange}
            />
            <FormText color="muted">
              If a queue is marked as fixed-location, students won&apos;t be
              able to set their own location.
            </FormText>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="location" sm={3}>
            Location
          </Label>
          <Col sm={9}>
            <Input
              type="text"
              name="location"
              placeholder="Siebel 0222"
              onChange={this.handleInputChange}
              value={this.state.location}
              valid={isValid(this.state.fieldErrors.location)}
            />
            {!this.state.fixedLocation && (
              <FormText color="muted">Setting a location is optional!</FormText>
            )}
            <FormFeedback>{this.state.fieldErrors.location}</FormFeedback>
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
              onClick={() => this.handleSubmit()}
            >
              Create
            </Button>
          </Col>
        </FormGroup>
      </Form>
    )
  }
}

NewQueue.defaultProps = {
  showCourseSelector: false,
}

NewQueue.propTypes = {
  showCourseSelector: PropTypes.bool,
  onCreateQueue: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  user: PropTypes.shape({
    staffAssignments: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
}

const mapStateToProps = state => ({
  user: state.user.user,
  courses: mapObjectToArray(state.courses.courses),
})

export default connect(mapStateToProps, null)(NewQueue)
