import React, { Fragment } from 'react'
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
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import constants from '../constants'
import { CREATE_QUESTION } from '../constants/ActionTypes'

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

const isInvalid = error => error !== undefined && error !== ''

export default class NewQuestion extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      netid: '',
      name: props.isUserCourseStaff ? '' : props.user.name || '',
      topic: '',
      location: '',
      fieldErrors: {},
      isOpen: !this.props.isUserCourseStaff,
      submitInProgress: false,
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  onCardHeaderClick() {
    if (!this.props.isUserCourseStaff) {
      // This isn't toggleable for normal users
      return
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }))
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    const fieldErrors = {}
    let valid = true

    fields.forEach(({ name, maxLength }) => {
      // Skip location validation if queue is in fixed location mode
      if (name === 'location' && this.props.queue.fixedLocation) return
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

    const netid = this.props.isUserCourseStaff
      ? this.state.netid || undefined
      : undefined
    const question = {
      netid,
      name: this.state.name,
      location: this.state.location,
      topic: this.state.topic,
    }
    // Disable the button while the request is in flight
    this.setState({
      submitInProgress: true,
    })
    this.props.createQuestion(this.props.queueId, question).then(action => {
      this.setState({
        submitInProgress: false,
      })
      if (action.type === CREATE_QUESTION.SUCCESS) {
        // Clear out all fields so user can add a new question
        this.setState({
          netid: '',
          name: this.props.isUserCourseStaff ? '' : this.props.user.name || '',
          location: '',
          topic: '',
        })
      }
    })
  }

  render() {
    const {
      queue: { location, fixedLocation },
      isUserCourseStaff,
    } = this.props

    const queueLocation = fixedLocation ? location : this.state.location

    const chevronClassNames = classNames({
      'new-question-expand': true,
      'ml-auto': true,
      open: this.state.isOpen,
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
            onClick={() => this.onCardHeaderClick()}
          >
            <strong>New question</strong>
            {isUserCourseStaff && (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={chevronClassNames}
              />
            )}
          </CardHeader>
          <Collapse isOpen={this.state.isOpen}>
            <CardBody>
              <Form onSubmit={this.handleSubmit} autoComplete="off">
                {isUserCourseStaff && (
                  <FormGroup row>
                    <Label for="netid" sm={2} md={3}>
                      Net ID
                    </Label>
                    <Col sm={10} md={9}>
                      <Input
                        name="netid"
                        id="netid"
                        placeholder="Enter a Net ID (optional)"
                        value={this.state.netid}
                        onChange={this.handleInputChange}
                      />
                      <FormText color="muted">
                        This allows you to add a question on behalf of a
                        student.
                      </FormText>
                    </Col>
                  </FormGroup>
                )}
                <FormGroup row>
                  <Label for="name" sm={2} md={3}>
                    Name
                  </Label>
                  <Col sm={10} md={9}>
                    <Input
                      name="name"
                      id="name"
                      placeholder={namePlaceholder}
                      value={this.state.name}
                      onChange={this.handleInputChange}
                      invalid={isInvalid(this.state.fieldErrors.name)}
                    />
                    <FormFeedback>{this.state.fieldErrors.name}</FormFeedback>
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
                      value={this.state.topic}
                      onChange={this.handleInputChange}
                      invalid={isInvalid(this.state.fieldErrors.topic)}
                    />
                    <FormFeedback>{this.state.fieldErrors.topic}</FormFeedback>
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
                      value={queueLocation}
                      disabled={fixedLocation}
                      onChange={this.handleInputChange}
                      invalid={isInvalid(this.state.fieldErrors.location)}
                    />
                    <FormFeedback>
                      {this.state.fieldErrors.location}
                    </FormFeedback>
                    {fixedLocation && (
                      <FormText>This is a fixed-location queue.</FormText>
                    )}
                  </Col>
                </FormGroup>
                <Alert
                  color="danger"
                  fade={false}
                  isOpen={!!this.props.questionError}
                >
                  {this.props.questionError}
                </Alert>
                <Button
                  block
                  color="primary"
                  type="submit"
                  disabled={this.state.submitInProgress}
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
