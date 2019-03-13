import React from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  CustomInput,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Label,
  Input,
  Button,
} from 'reactstrap'
import { connect } from 'react-redux'

import { mapObjectToArray } from '../util'

const isInvalid = error => error !== undefined && error !== ''

class NewQueue extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      course: 'none',
      name: '',
      location: '',
      fixedLocation: false,
      isConfidential: false,
      fieldErrors: {},
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit()
    }
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
      fixedLocation: this.state.fixedLocation,
      isConfidential: this.state.isConfidential,
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
                invalid={isInvalid(this.state.fieldErrors.course)}
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
              onKeyDown={this.handleKeyPress}
              value={this.state.name}
              invalid={isInvalid(this.state.fieldErrors.name)}
            />
            <FormFeedback>{this.state.fieldErrors.name}</FormFeedback>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="fixedLocation" sm={3}>
            Fixed location
          </Label>
          <Col sm={9}>
            <CustomInput
              id="fixedLocation"
              type="switch"
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
          <Label for="isConfidential" sm={3}>
            Confidential Queue
          </Label>
          <Col sm={9}>
            <CustomInput
              id="isConfidential"
              type="switch"
              name="isConfidential"
              defaultChecked={false}
              onChange={this.handleInputChange}
            />
            <FormText color="muted">
              If a queue is marked as confidential, students won&apos;t be able
              to see other student names and topics.
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
              onKeyDown={this.handleKeyPress}
              value={this.state.location}
              invalid={isInvalid(this.state.fieldErrors.location)}
            />
            {this.state.fixedLocation ? (
              <FormText color="muted">
                Students will see this location when asking a question, but
                won&apos;t be able to change it.
              </FormText>
            ) : (
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
  courses: mapObjectToArray(state.courses.courses).sort((a, b) => {
    const x = a.name.toLowerCase()
    const y = b.name.toLowerCase()
    if (x < y) {
      return -1
    }
    if (x > y) {
      return 1
    }
    return 0
  }),
})

export default connect(
  mapStateToProps,
  null
)(NewQueue)
