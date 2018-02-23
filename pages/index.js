import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardSubtitle,
} from 'reactstrap'
import withRedux from 'next-redux-wrapper'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faMapMarker from '@fortawesome/fontawesome-free-solid/faMapMarker'
import faQuestion from '@fortawesome/fontawesome-free-solid/faQuestionCircle'

import { Link, Router } from '../routes'
import makeStore from '../redux/makeStore'
import { fetchCoursesRequest, fetchCourses, createCourse } from '../actions/course'
import { fetchQueues } from '../actions/queue'

import PageWithUser from '../components/PageWithUser'
import Loading from '../components/Loading'
import Layout from '../components/Layout'
import NewCourse from '../components/NewCourse'
import ShowForAdmin from '../components/ShowForAdmin'
import QueueCard from '../components/QueueCard'


class Index extends React.Component {
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
    this.props.fetchQueues()
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

  handleQueueClick(id) {
    Router.pushRoute('queue', { id })
  }

  render() {
    if (this.props.isFetching) {
      return <Loading />
    }
    let courses
    if (this.props.courses && this.props.courses.length > 0) {
      courses = this.props.courses.map(course => (
        <Link route="course" params={{ id: course.id }} key={course.id} prefetch passHref>
          <ListGroupItem tag="a" action>{course.name}</ListGroupItem>
        </Link>
      ))
    } else {
      courses = (
        <div>
          <ListGroupItem className="text-center text-muted pt-4 pb-4">
            There aren&apos;t any courses yet
          </ListGroupItem>
        </div>
      )
    }

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
      <ShowForAdmin>
        <ListGroupItem action className="text-muted" onClick={() => this.showCreateCoursePanel()}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Create a course
        </ListGroupItem>
      </ShowForAdmin>
    )

    return (
      <Layout>
        <Container>
          <h1 className="display-4 mb-4">Open queues</h1>
          <Row className="equal-height">
            <Col xs={{ size: 12 }} md={{ size: 6 }} lg={{ size: 4 }}>
              <QueueCard onClick={id => this.handleQueueClick(1)} />
            </Col>
            <Col xs={{ size: 12 }} md={{ size: 6 }} lg={{ size: 4 }}>
              <QueueCard />
            </Col>
          </Row>
        </Container>
        <Container className="d-none">
          <Card className="courses-card">
            <CardHeader className="bg-primary text-white">
              <CardTitle tag="h3">Hey there!</CardTitle>
              <CardSubtitle>Select your course from the list below.</CardSubtitle>
            </CardHeader>
            <ListGroup flush>
              {!this.props.isFetching && courses}
              {this.props.isFetching && loadingSpinner}
              {!this.state.showCreateCoursePanel && createCourseButton}
              {this.state.showCreateCoursePanel && createCoursePanel}
            </ListGroup>
          </Card>
        </Container>
        <style global jsx>{`
          .courses-card {
            width: 100%;
            max-width: 500px;
            margin: auto;
          }
          .row.equal-height {
            display: flex;
            flex-wrap: wrap;
          }
          .row.equal-height > [class*='col-'] {
            display: flex;
            flex-direction: column;
          }
          .row.equal-height .card {
            flex: 1;
          }
        `}</style>
      </Layout>
    )
  }
}

Index.propTypes = {
  isFetching: PropTypes.bool,
  courses: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })),
  fetchCourses: PropTypes.func.isRequired,
  createCourse: PropTypes.func.isRequired,
}

Index.defaultProps = {
  isFetching: false,
  courses: [],
}

const mapStateToProps = state => ({
  coursesByKey: state.courses.courses,
  courses: Object.keys(state.courses.courses).sort().map(id => state.courses.courses[id]),
  queuesById: state.queues.queues,
  queues: Object.keys(state.queues.queues).sort().map(id => state.queues.queues[id])
  isFetching: state.courses.isFetching,
})

const mapDispatchToProps = dispatch => ({
  fetchCourses: () => dispatch(fetchCourses()),
  fetchQueues: () => dispatch(fetchQueues()),
  createCourse: course => dispatch(createCourse(course)),
})

export default withRedux(makeStore, mapStateToProps, mapDispatchToProps)(PageWithUser(Index))
