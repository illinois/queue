import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  ListGroup,
  ListGroupItem,
  Card,
  CardHeader,
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
import NewCourse from '../components/NewCourse'
import { fetchCoursesRequest, fetchCourses, createCourse } from '../actions/course'

class Page extends React.Component {
  static async getInitialProps({ store, isServer }) {
    if (isServer) {
      // We're going to start loading as soon as we're on the client
      store.dispatch(fetchCoursesRequest())
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      showCreateCoursePanel: false,
    }
  }

  componentDidMount() {
    this.props.fetchCourses()
  }

  showCreateCoursePanel() {
    this.setState({
      showCreateCoursePanel: true,
    })
  }

  hideCreateCoursePanel() {
    this.setState({
      showCreateCoursePanel: false,
    })
  }

  createCourse(course) {
    this.props.createCourse(course).then(() => this.hideCreateCoursePanel())
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

    const createCoursePanel = (
      <NewCourse
        onCreateCourse={course => this.createCourse(course)}
        onCancel={() => this.hideCreateCoursePanel()}
      />
    )

    const createCourseButton = (
      <ListGroupItem action className="text-muted" onClick={() => this.showCreateCoursePanel()}>
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Create a course
      </ListGroupItem>
    )

    return (
      <Layout>
        <Container>
          <Card className="courses-card">
            <CardHeader className="bg-primary text-white">
              <CardTitle tag="h3">Hey there!</CardTitle>
              <CardSubtitle>Please select your course from the list below.</CardSubtitle>
            </CardHeader>
            <ListGroup flush>
              {!this.props.isFetching && courses}
              {this.props.isFetching && loadingSpinner}
              {!this.state.showCreateCoursePanel && createCourseButton}
              {this.state.showCreateCoursePanel && createCoursePanel}
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
  courses: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })),
  fetchCourses: PropTypes.func.isRequired,
  createCourse: PropTypes.func.isRequired,
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
  createCourse: course => dispatch(createCourse(course)),
})

export default withRedux(makeStore, mapStateToProps, mapDispatchToProps)(Page)
