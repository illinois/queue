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

class QuestionEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      location: '',
      isFieldValid: {},
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleModalExit = this.handleModalExit.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleCancel() {
    this.props.onCancel()
  }

  handleSubmitEdit() {
    if (this.state.location == '') { // == ''
      this.setState({
        isFieldValid: {
          location: false,
        },
      })
    } else {
      const attributes = {
        location: this.state.location,
       }
      this.props.onSubmitQuestionEdit(attributes)
    }
  }

  handleModalExit() {
    // Wipe feedback for the next time the modal is opened
    this.setState({
      location: '',
      isFieldValid: {},
    })
  }

  render() {
    const locationWarning = (this.state.isFieldValid.location === false) ? (
      <div className="invalid-feedback d-block">This is required!</div>
    ) : null

    return (
      <Modal isOpen={this.props.isOpen} onClosed={this.handleModalExit}>
        <ModalHeader>Edit Question</ModalHeader>
        <ModalBody>
          <Form autoComplete="off">
            <FormGroup row>
              <Label for="location" sm={4}>New Location</Label>
              <Col sm={8}>
                <Input
                  type="text"
                  name="location"
                  id="location"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                />
                <FormText color="muted">
                </FormText>
                {locationWarning}
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={this.handleCancel}>Cancel</Button>
          <Button color="primary" onClick={this.handleSubmitEdit}>Update</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

QuestionEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmitQuestionEdit: PropTypes.func.isRequired,
}

export default QuestionEdit
