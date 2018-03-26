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
  FormText,
  Input,
  Label,
  ButtonGroup,
  Button,
} from 'reactstrap'

class QuestionFeedback extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      comments: '',
      preparedness: '',
      isFieldValid: {},
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmitFeedback = this.handleSubmitFeedback.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleModalExit = this.handleModalExit.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handlePreparednessChange(preparedness) {
    this.setState({ preparedness })
  }

  handleCancel() {
    this.props.onCancel()
  }

  handleSubmitFeedback() {
    if (!this.state.preparedness) {
      this.setState({
        isFieldValid: {
          preparedness: false,
        },
      })
    } else {
      const feedback = {
        preparedness: this.state.preparedness,
        comments: this.state.comments,
      }

      this.props.onSubmitFeedback(feedback)
    }
  }

  handleModalExit() {
    // Wipe feedback for the next time the modal is opened
    this.setState({
      comments: '',
      preparedness: null,
      isFieldValid: {},
    })
  }

  render() {
    const preparednessWarning =
      this.state.isFieldValid.preparedness === false ? (
        <div className="invalid-feedback d-block">This is required!</div>
      ) : null

    return (
      <Modal isOpen={this.props.isOpen} onClosed={this.handleModalExit}>
        <ModalHeader>Student Feedback</ModalHeader>
        <ModalBody>
          <Form autoComplete="off">
            <FormGroup row>
              <Label for="preparedness" sm={4}>
                Preparedness
              </Label>
              <Col sm={8}>
                <ButtonGroup>
                  <Button
                    color="primary"
                    onClick={() => this.handlePreparednessChange('bad')}
                    active={this.state.preparedness === 'bad'}
                  >
                    Bad
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => this.handlePreparednessChange('average')}
                    active={this.state.preparedness === 'average'}
                  >
                    Average
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => this.handlePreparednessChange('good')}
                    active={this.state.preparedness === 'good'}
                  >
                    Good
                  </Button>
                </ButtonGroup>
                {preparednessWarning}
                <FormText color="muted">
                  <i>(required)</i> Select the level of preparedness the student
                  exhibited when asking their question.
                </FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="comments" sm={4}>
                Comments
              </Label>
              <Col sm={8}>
                <Input
                  type="textarea"
                  name="comments"
                  id="comments"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                />
                <FormText color="muted">
                  Enter any comments you had about the interaction with the
                  student.
                </FormText>
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={this.handleCancel}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.handleSubmitFeedback}>
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

QuestionFeedback.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmitFeedback: PropTypes.func.isRequired,
}

export default QuestionFeedback
