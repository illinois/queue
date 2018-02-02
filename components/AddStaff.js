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

class AddStaff extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      netid: '',
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleAddStaff = this.handleAddStaff.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleAddStaff() {
    const staff = {
      name: this.state.name,
      netid: this.state.netid,
    }

    this.props.onAddStaff(staff)
  }

  render() {
    return (
      <ListGroupItem>
        <Form autoComplete="off">
          <FormGroup row>
            <Label for="netid" sm={3}>Net ID</Label>
            <Col sm={9}>
              <Input
                type="text"
                name="netid"
                onChange={this.handleInputChange}
                value={this.state.netid}
              />

            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="name" sm={3}>Name</Label>
            <Col sm={9}>
              <Input
                type="text"
                name="name"
                onChange={this.handleInputChange}
                value={this.state.name}
              />
              <FormText color="muted">
                (optional)
              </FormText>
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
                onClick={() => this.handleAddStaff()}
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

AddStaff.propTypes = {
  onAddStaff: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default AddStaff
