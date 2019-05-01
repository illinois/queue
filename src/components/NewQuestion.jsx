import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  Collapse,
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
import { useInput } from 'react-hanger'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import getConfig from 'next/config'

import constants from '../constants'
import { CREATE_QUESTION } from '../constants/ActionTypes'
import UserAutocomplete from './UserAutocomplete'

const { uidName, uidArticle } = getConfig().publicRuntimeConfig

const validateField = (value, maxLength) => {
  if (!value) {
    return 'This field is required!'
  }
  if (value.length > maxLength) {
    return `This field has a maximum length of ${maxLength} characters`
  }
  return undefined
}

const hasErrors = invalidFields => {
  return Object.keys(invalidFields).reduce((isInvalid, fieldName) => {
    return isInvalid || !!invalidFields[fieldName]
  }, false)
}

const isInvalid = error => error !== undefined && error !== ''

const capitalizeString = string =>
  string.charAt(0).toUpperCase() + string.slice(1)

const NewQuestion = props => {
  const [isOpen, setIsOpen] = useState(!props.isUserCourseStaff)
  const [pendingUser, setPendingUser] = useState([])
  const nameInput = useInput(
    props.isUserCourseStaff ? '' : props.user.name || ''
  )
  const topicInput = useInput('')
  const locationInput = useInput('')
  const [submitInProgress, setSubmitInProgress] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const onCardHeaderClick = () => {
    if (!props.isUserCourseStaff) {
      // This isn't toggleable for normal users
      return
    }
    setIsOpen(current => !current)
  }

  const onUserChanged = users => {
    setPendingUser(users)
    if (users.length === 1 && users[0].name && !nameInput.value) {
      nameInput.setValue(users[0].name)
    }
  }

  const onSubmit = e => {
    e.preventDefault()
    const newFieldErrors = {}
    // Skip location validation if queue is in fixed location mode
    if (!props.queue.fixedLocation) {
      newFieldErrors.location = validateField(
        locationInput.value,
        constants.QUESTION_LOCATION_MAX_LENGTH
      )
    }
    newFieldErrors.name = validateField(
      nameInput.value,
      constants.QUESTION_NAME_MAX_LENGTH
    )
    newFieldErrors.topic = validateField(
      topicInput.value,
      constants.QUESTION_TOPIC_MAX_LENGTH
    )
    setFieldErrors(newFieldErrors)
    if (hasErrors(newFieldErrors)) return

    const uid = props.isUserCourseStaff
      ? (pendingUser[0] && pendingUser[0].uid) || undefined
      : undefined
    const question = {
      uid,
      name: nameInput.value,
      location: locationInput.value,
      topic: topicInput.value,
    }
    // Disable the button while the request is in flight
    setSubmitInProgress(true)
    props.createQuestion(props.queueId, question).then(action => {
      setSubmitInProgress(false)
      if (action.type === CREATE_QUESTION.SUCCESS) {
        // Clear out all fields so user can add a new question
        setPendingUser([])
        nameInput.setValue(props.isUserCourseStaff ? '' : props.user.name || '')
        locationInput.setValue('')
        topicInput.setValue('')
      }
    })
  }

  const { queue, isUserCourseStaff } = props
  const queueLocation = queue.fixedLocation
    ? queue.location
    : locationInput.value

  const chevronClassNames = classNames({
    'new-question-expand': true,
    'ml-auto': true,
    open: isOpen,
  })

  const headerClassNames = classNames({
    'd-flex align-items-center': true,
    'new-question-header-clickable': isUserCourseStaff,
  })

  const namePlaceholder = `Enter ${isUserCourseStaff ? 'a' : 'your'} name`

  const topicPlaceholder = `Enter a brief topic for ${
    isUserCourseStaff ? 'the' : 'your'
  } question`

  const locationPlaceholder = `Enter ${
    isUserCourseStaff ? 'a' : 'your'
  } location`

  return (
    <Fragment>
      <Card color="light" className="mb-3">
        <CardHeader
          sm={2}
          className={headerClassNames}
          onClick={onCardHeaderClick}
        >
          <strong>New question</strong>
          {isUserCourseStaff && (
            <FontAwesomeIcon
              icon={faChevronDown}
              className={chevronClassNames}
            />
          )}
        </CardHeader>
        <Collapse isOpen={isOpen}>
          <CardBody>
            <Form onSubmit={onSubmit} autoComplete="off">
              {isUserCourseStaff && (
                <FormGroup row>
                  <Label for="question-user" sm={2} md={3}>
                    {capitalizeString(uidName)}
                  </Label>
                  <Col sm={10} md={9}>
                    <UserAutocomplete
                      id="question-user"
                      placeholder={`Enter ${uidArticle} ${uidName} (optional)`}
                      onChange={onUserChanged}
                      selected={pendingUser}
                      // This is to account for the case where someone on queue
                      // staff wants to add a user that's never signed into the
                      // queue before, and thus doesn't have an account to
                      // autocomplete
                      allowNew
                      newSelectionPrefix="New user: "
                    />
                    <FormText color="muted">
                      This allows you to add a question on behalf of a student.
                    </FormText>
                  </Col>
                </FormGroup>
              )}
              <FormGroup row>
                <Label for="student-name" sm={2} md={3}>
                  Name
                </Label>
                <Col sm={10} md={9}>
                  <Input
                    id="student-name"
                    placeholder={namePlaceholder}
                    {...nameInput.bindToInput}
                    invalid={isInvalid(fieldErrors.name)}
                    autoComplete="new-password"
                  />
                  <FormFeedback>{fieldErrors.name}</FormFeedback>
                  <FormText color="muted">Using a nickname is fine!</FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="topic" sm={2} md={3}>
                  Topic
                </Label>
                <Col sm={10} md={9}>
                  <Input
                    name="topic"
                    id="topic"
                    placeholder={topicPlaceholder}
                    {...topicInput.bindToInput}
                    invalid={isInvalid(fieldErrors.topic)}
                  />
                  <FormFeedback>{fieldErrors.topic}</FormFeedback>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="location" sm={2} md={3}>
                  Location
                </Label>
                <Col sm={10} md={9}>
                  <Input
                    name="location"
                    id="location"
                    placeholder={locationPlaceholder}
                    disabled={queue.fixedLocation}
                    onChange={locationInput.onChange}
                    value={queueLocation}
                    invalid={isInvalid(fieldErrors.location)}
                  />
                  <FormFeedback>{fieldErrors.location}</FormFeedback>
                  {queue.fixedLocation && (
                    <FormText>This is a fixed-location queue.</FormText>
                  )}
                </Col>
              </FormGroup>
              <Alert color="danger" fade={false} isOpen={!!props.questionError}>
                {props.questionError}
              </Alert>
              <Button
                block
                color="primary"
                type="submit"
                disabled={submitInProgress}
              >
                Add to queue
              </Button>
            </Form>
          </CardBody>
        </Collapse>
      </Card>
      <style jsx>{`
        :global(.new-question-expand) {
          transition: all 400ms;
        }
        :global(.new-question-expand.open) {
          transform: rotateX(180deg);
        }
        :global(.new-question-header-clickable) {
          cursor: pointer;
        }
      `}</style>
    </Fragment>
  )
}

NewQuestion.defaultProps = {
  queue: {
    location: '',
    fixedLocation: false,
  },
  questionError: null,
}

NewQuestion.propTypes = {
  queueId: PropTypes.number.isRequired,
  queue: PropTypes.shape({
    location: PropTypes.string,
    fixedLocation: PropTypes.bool.isRequired,
  }),
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  createQuestion: PropTypes.func.isRequired,
  questionError: PropTypes.string,
  isUserCourseStaff: PropTypes.bool.isRequired,
}

export default NewQuestion
