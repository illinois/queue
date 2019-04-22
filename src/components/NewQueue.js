import React, { useState } from 'react'
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
import { useInput, useBoolean } from 'react-hanger'
import { connect } from 'react-redux'
import classnames from 'classnames'

import Select from './Select'
import { mapObjectToArray } from '../util'

const isInvalid = error => error !== undefined && error !== ''

const NewQueue = props => {
  const [course, setCourse] = useState(null)
  const name = useInput('')
  const location = useInput('')
  const fixedLocation = useBoolean(false)
  const isConfidential = useBoolean(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const { courses, user, showCourseSelector } = props

  const handleSubmit = () => {
    const currentFieldErrors = {}

    // Only validate the course if the course selector is shown
    if (props.showCourseSelector && course === null) {
      currentFieldErrors.course = 'You must select a course'
    }

    if (!name.value) {
      currentFieldErrors.name = 'You must name this queue'
    }

    if (fixedLocation.value && !location.value) {
      currentFieldErrors.location =
        'You must set a location for a fixed-location queue'
    }

    if (Object.keys(currentFieldErrors).length > 0) {
      setFieldErrors(currentFieldErrors)
      return
    }

    const queue = {
      name: name.value,
      location: location.value,
      fixedLocation: fixedLocation.value,
      isConfidential: isConfidential.value,
    }

    const courseId = course && course.value

    props.onCreateQueue(queue, courseId)
  }

  let courseOptions = []
  if (showCourseSelector) {
    let userCourses = courses
    if (!user.isAdmin) {
      userCourses = courses.filter(
        c => user.staffAssignments.indexOf(c.id) !== -1
      )
    }
    courseOptions = userCourses.map(c => ({
      value: c.id,
      label: c.name,
    }))
  }

  return (
    <Form autoComplete="off" onSubmit={handleSubmit}>
      {showCourseSelector && (
        <FormGroup row>
          <Label for="course" sm={3}>
            Course
          </Label>
          <Col sm={9}>
            <Select
              type="select"
              name="course"
              id="course"
              onChange={item => setCourse(item)}
              value={course}
              invalid={isInvalid(fieldErrors.course)}
              options={courseOptions}
            >
              <option value="none" disabled>
                Select a course
              </option>
              {courseOptions}
            </Select>
            <FormFeedback
              className={classnames({
                // Need to do this because our custom Select component
                // doesn't have the right Bootstrap classes for it to be shwon
                // automatically
                'd-block': isInvalid(fieldErrors.course),
              })}
            >
              {fieldErrors.course}
            </FormFeedback>
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
            {...name.bindToInput}
            invalid={isInvalid(fieldErrors.name)}
          />
          <FormFeedback>{fieldErrors.name}</FormFeedback>
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
            onChange={e => fixedLocation.setValue(e.target.checked)}
          />
          <FormText color="muted">
            If a queue is marked as fixed-location, students won&apos;t be able
            to set their own location.
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
            onChange={e => isConfidential.setValue(e.target.checked)}
          />
          <FormText color="muted">
            If a queue is marked as confidential, students won&apos;t be able to
            see other student names and topics.
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
            {...location.bindToInput}
            invalid={isInvalid(fieldErrors.location)}
          />
          {fixedLocation ? (
            <FormText color="muted">
              Students will see this location when asking a question, but
              won&apos;t be able to change it.
            </FormText>
          ) : (
            <FormText color="muted">Setting a location is optional!</FormText>
          )}
          <FormFeedback>{fieldErrors.location}</FormFeedback>
        </Col>
      </FormGroup>
      <FormGroup row className="mb-0">
        <Col md={6}>
          <Button block color="secondary" type="submit">
            Cancel
          </Button>
        </Col>
        <Col md={6}>
          <Button block color="primary" type="button" onClick={handleSubmit}>
            Create
          </Button>
        </Col>
      </FormGroup>
    </Form>
  )
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
