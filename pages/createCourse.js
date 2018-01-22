import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {
  Container,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap'
import withRedux from 'next-redux-wrapper'

import { createCourse } from '../actions/course'
import makeStore from '../redux/makeStore'
import Layout from '../components/Layout'

class Page extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit() {
    const course = {
      name: this.state.name,
    }

    this.props.createCourse(course).then(() => {
      Router.push('/')
    })
  }

  render() {
    return (
      <Layout>
        <Container>
          <h1 className="mb-4">Create a course</h1>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup row>
              <Label for="name" sm={2}>Name</Label>
              <Col sm={10}>
                <Input
                  name="name"
                  id="name"
                  placeholder="Enter the course name (e.g. CS 225)"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                />
              </Col>
            </FormGroup>
            <Button
              block
              color="primary"
              type="button"
              onClick={this.handleSubmit}
            >
              Create course
            </Button>
          </Form>
        </Container>
      </Layout>
    )
  }
}

Page.propTypes = {
  createCourse: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  createCourse: course => dispatch(createCourse(course)),
})

export default withRedux(makeStore, null, mapDispatchToProps)(Page)
