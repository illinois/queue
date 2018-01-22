import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  ListGroup,
  ListGroupItem,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
} from 'reactstrap'
import withRedux from 'next-redux-wrapper'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'

import { Link } from '../routes'
import makeStore from '../redux/makeStore'
import Layout from '../components/Layout'
import { fetchCourses, requestCourses } from '../actions/course'

class Page extends React.Component {
  static async getInitialProps({ store, isServer }) {
    if (isServer) {
      // We're going to start loading as soon as we're on the client
      store.dispatch(requestCourses())
    }
  }

  componentDidMount() {
    this.props.fetchCourses()
  }

  render() {
    const courses = this.props.courses.map(course => (
      <Link route="course" params={{ id: course.id }} key={course.id} passHref>
        <ListGroupItem tag="a" action>{course.name}</ListGroupItem>
      </Link>
    ))

    const loadingSpinner = (
      <ListGroupItem className="text-center">
        <FontAwesomeIcon icon={faSpinner} pulse />
      </ListGroupItem>
    )

    return (
      <Layout>
        <Container>
          <Card className="courses-card">
            <CardBody>
              <CardTitle tag="h3">Hey there!</CardTitle>
              <CardSubtitle>Please select your course from the list below.</CardSubtitle>
            </CardBody>
            <ListGroup flush>
              {!this.props.isFetching && courses}
              {this.props.isFetching && loadingSpinner}
              <Link route="createCourse" passHref key="create">
                <ListGroupItem tag="a" action className="text-muted">
                  <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                  Create a course
                </ListGroupItem>
              </Link>
            </ListGroup>
          </Card>
        </Container>
        <style jsx>{`
          :global(.courses-card) {
            width: 100%;
            max-width: 500px;
            margin: auto;
          }
        `}</style>
      </Layout>
    )
  }
}

Page.propTypes = {
  isFetching: PropTypes.bool,
  fetchCourses: PropTypes.func.isRequired,
  courses: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })),
}

Page.defaultProps = {
  isFetching: false,
  courses: [],
}

const mapStateToProps = state => ({
  courses: Object.keys(state.courses.courses).sort().map(id => state.courses.courses[id]),
  isFetching: state.courses.isFetching,
})

const mapDispatchToProps = dispatch => ({
  fetchCourses: () => dispatch(fetchCourses()),
})

export default withRedux(makeStore, mapStateToProps, mapDispatchToProps)(Page)
