import React from 'react'
import { Container } from 'reactstrap'

import PageWithUser from '../components/PageWithUser'

class CourseRequests extends React.Component {
  render() {
    return (
      <Container>
        <h1 className="display-4">Course Requests</h1>
      </Container>
    )
  }
}

export default PageWithUser(CourseRequests)
