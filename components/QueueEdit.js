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
  Input,
  Label,
  Button,
  FormFeedback,
} from 'reactstrap'

const fields = [
  {
    name: 'name',
    minLength: 1,
  },
]

const isValid = error => (error === undefined ? undefined : error === '')

class QueueEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      location: '',
      isFieldValid: {},
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleModalExit = this.handleModalExit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (nextProps.queue) {
      this.setState({
        name: nextProps.queue.name,
        topic: nextProps.queue.topic,
        isFieldValid: {},
      })
    }
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleCancel() {
    this.props.onCancel()
    console.log(this.props)
  }

  handleSubmitEdit() {
    const isFieldValid = {}
    let valid = true

    fields.forEach(({ name, minLength }) => {
      if (!this.state[name]) {
        isFieldValid[name] = 'This field is required!'
        valid = false
      } else if (this.state[name].length < minLength) {
        isFieldValid[
          name
        ] = `This field has a minimum length of ${minLength} characters`
        valid = false
      }
    })

    this.setState({
      isFieldValid,
    })
    if (!valid) return

    const attributes = {
      name: this.state.name,
      location: this.state.location,
    }
    this.props.onSubmitQueueEdit(attributes)
  }

  handleModalExit() {
    this.setState({
      name: '',
      location: '',
      isFieldValid: {},
    })
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} onClosed={this.handleModalExit}>
        <ModalHeader>Edit Queue</ModalHeader>
        <ModalBody>
          <Form autoComplete="off">
            <FormGroup row>
              <Label for="name" sm={4}>
                Name
              </Label>
              <Col sm={8}>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                  valid={isValid(this.state.isFieldValid.name)}
                />
              <FormFeedback>{this.state.isFieldValid.name}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="location" sm={4}>
                Location
              </Label>
              <Col sm={8}>
                <Input
                  type="text"
                  name="location"
                  id="location"
                  value={this.state.location}
                  onChange={this.handleInputChange}
                  valid={isValid(this.state.isFieldValid.location)}
                />
                <FormFeedback>{this.state.isFieldValid.location}</FormFeedback>
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={this.handleCancel}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.handleSubmitEdit}>
            Update
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

QueueEdit.propTypes = {
  queue: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmitQueueEdit: PropTypes.func.isRequired,
}

QueueEdit.defaultProps = {
  queue: null,
}

export default QueueEdit
