import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CustomInput,
  Button,
  Input,
  Form,
  FormGroup,
  FormText,
  Label,
  Col,
} from 'reactstrap'
import { useInput, useBoolean } from 'react-hanger'
import { faSlidersH } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface GeneralPanelProps {
  course: {
    name: string
    shortcode: string
    isUnlisted: boolean
    questionFeedback: boolean
  }
  isAdmin: boolean
  updateCourse: (course: {
    name: string
    shortcode: string
    isUnlisted: boolean
    questionFeedback: boolean
  }) => void
}

const GeneralPanel = ({ course, isAdmin, updateCourse }: GeneralPanelProps) => {
  const name = useInput(course.name)
  const shortcode = useInput(course.shortcode)
  const isUnlisted = useBoolean(course.isUnlisted)
  const questionFeedback = useBoolean(course.questionFeedback)
  const changed =
    name.value !== course.name ||
    shortcode.value !== course.shortcode ||
    isUnlisted.value !== course.isUnlisted ||
    questionFeedback.value !== course.questionFeedback
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateCourse({
      name: name.value,
      shortcode: shortcode.value,
      isUnlisted: isUnlisted.value,
      questionFeedback: questionFeedback.value,
    })
  }

  return (
    <Card className="mb-3">
      <CardHeader>
        <CardTitle tag="h5" className="mb-0">
          <FontAwesomeIcon icon={faSlidersH} className="mr-2" /> General
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Form autoComplete="off" onSubmit={onSubmit}>
          {isAdmin && (
            <>
              <FormGroup row>
                <Label for="name" sm={3}>
                  Name
                </Label>
                <Col sm={9}>
                  <Input id="name" {...name.bindToInput} />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="shortcode" sm={3}>
                  Shortcode
                </Label>
                <Col sm={9}>
                  <Input id="shortcode" {...shortcode.bindToInput} />
                </Col>
              </FormGroup>
            </>
          )}
          <FormGroup row>
            <Label for="isUnlisted" sm={3}>
              Unlisted
            </Label>
            <Col sm={9}>
              <CustomInput
                id="isUnlisted"
                type="switch"
                name="isUnlisted"
                onChange={isUnlisted.toggle}
                checked={isUnlisted.value}
              />
              <FormText color="muted">
                Making your course unlisted will only allow students with the
                course shortcode to view this course.
              </FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="questionFeedback" sm={3}>
              Enable Question Feedback
            </Label>
            <Col sm={9}>
              <CustomInput
                id="questionFeedback"
                type="switch"
                name="questionFeedback"
                onChange={questionFeedback.toggle}
                checked={questionFeedback.value}
              />
              <FormText color="muted">
                Allowing question feedback will let your course staff provide
                feedback after answering each student&apos;s question.
              </FormText>
            </Col>
          </FormGroup>
          <Button disabled={!changed} color="primary" type="submit">
            Update
          </Button>
        </Form>
      </CardBody>
    </Card>
  )
}

GeneralPanel.propTypes = {
  course: PropTypes.shape({
    name: PropTypes.string,
    shortcode: PropTypes.string,
    isUnlisted: PropTypes.bool,
    questionFeedback: PropTypes.bool,
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  updateCourse: PropTypes.func.isRequired,
}

export default GeneralPanel
