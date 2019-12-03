import React from 'react'
import PropTypes from 'prop-types'
import { Form, FormGroup, Input, Button } from 'reactstrap'

class AddStaff extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
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

  handleAddStaff(e) {
    if (e) e.preventDefault()
    const staff = {
      netid: this.state.netid,
    }

    this.props.onAddStaff(staff)

    // Wipe the netid so more staff can be added
    this.setState({ netid: '' })
  }

  render() {
    return (
      <FormGroup>
        <Form
          autoComplete="off"
          className="d-flex align-items-center"
          style={{ flexWrap: 'nowrap' }}
          onSubmit={e => this.handleAddStaff(e)}
        >
          <Input
            type="text"
            name="netid"
            placeholder="Enter a NetID"
            className="mr-3"
            onChange={this.handleInputChange}
            value={this.state.netid}
          />

          <Button
            color="primary"
            type="button"
            onClick={() => this.handleAddStaff()}
          >
            Add staff
          </Button>
        </Form>
      </FormGroup>
    )
  }
}

AddStaff.propTypes = {
  onAddStaff: PropTypes.func.isRequired,
}

export default AddStaff
