import React from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  ListGroupItem,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  Button,
} from 'reactstrap'

class NewQueue extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      location: '',
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleCreateQueue = this.handleCreateQueue.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleCreateQueue() {
    const queue = {
      name: this.state.name,
      location: this.state.location,
    }

    this.props.createQueue(this.props.courseId, queue)
  }

  render() {
    return (
      <ListGroupItem>
        <Form>
          <FormGroup row>
            <Label for="name" sm={3}>Name</Label>
            <Col sm={9}>
              <Input
                type="text"
                name="name"
                placeholder="Office Hours"
                onChange={this.handleInputChange}
                value={this.state.name}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="location" sm={3}>Location</Label>
            <Col sm={9}>
              <Input
                type="text"
                name="location"
                placeholder="Siebel 0222"
                onChange={this.handleInputChange}
                value={this.state.location}
              />
              <FormText color="muted">
                Setting a location is optional!
              </FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
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
                onClick={() => this.handleCreateQueue()}
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

NewQueue.propTypes = {
  createQueue: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  courseId: PropTypes.string.isRequired,
}

export default NewQueue
