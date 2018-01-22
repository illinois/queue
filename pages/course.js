import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  ListGroup,
  ListGroupItem,
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap'
import withRedux from 'next-redux-wrapper'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'

import { Link } from '../routes'
import makeStore from '../redux/makeStore'
import { requestCourse, fetchCourse } from '../actions/course'
import { createQueue } from '../actions/queue'
import Layout from '../components/Layout'
import NewQueue from '../components/NewQueue'

class Page extends React.Component {
  static async getInitialProps({ isServer, store, query }) {
    if (isServer) {
      store.dispatch(requestCourse())
    }
    return {
      courseId: query.id,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      showCreateQueuePanel: false,
    }
  }

  componentDidMount() {
    this.props.fetchCourse(this.props.courseId)
  }

  showCreateQueuePanel() {
    this.setState({
      showCreateQueuePanel: true,
    })
  }

  hideCreateQueuePanel() {
    this.setState({
      showCreateQueuePanel: false,
    })
  }

  render() {
    let queues
    if (this.props.course && this.props.course.queues && this.props.queues) {
      queues = this.props.course.queues.map((id) => {
        const queue = this.props.queues[id]
        return (
          <Link route="queue" params={{ id }} key={id} passHref>
            <ListGroupItem tag="a" action>
              <div className="h5">{queue.name}</div>
              <div className="text-muted">Location: {queue.location}</div>
            </ListGroupItem>
          </Link>
        )
      })
    } else {
      queues = (
        <ListGroupItem className="text-center">
          <FontAwesomeIcon icon={faSpinner} pulse />
        </ListGroupItem>
      )
    }

    let createQueuePanel
    if (this.state.showCreateQueuePanel) {
      createQueuePanel = (
        <NewQueue
          courseId={this.props.courseId}
          createQueue={this.props.createQueue}
          onCancel={() => this.hideCreateQueuePanel()}
        />
      )
    }

    const createQueueButton = (
      <ListGroupItem action className="text-muted" onClick={() => this.showCreateQueuePanel()}>
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Create a queue
      </ListGroupItem>
    )

    return (
      <Layout>
        <Container fluid>
          <Card className="courses-card">
            <CardBody>
              <CardTitle tag="h3">
                {this.props.course && this.props.course.name}
              </CardTitle>
            </CardBody>
            <ListGroup flush>
              {queues}
              {!this.state.showCreateQueuePanel && createQueueButton}
              {createQueuePanel}
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
  courseId: PropTypes.string.isRequired,
  course: PropTypes.shape({
    name: PropTypes.string,
    queues: PropTypes.arrayOf(PropTypes.number),
  }),
  queues: PropTypes.objectOf(PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.location,
  })),
  createQueue: PropTypes.func.isRequired,
  fetchCourse: PropTypes.func.isRequired,
}

Page.defaultProps = {
  course: null,
  queues: null,
}

const mapStateToProps = (state, ownProps) => {
  const course = state.courses.courses[ownProps.courseId]
  return {
    course,
    queues: state.queues.queues,
    isFetching: state.courses.isFetching,
  }
}

const mapDispatchToProps = dispatch => ({
  fetchCourse: courseId => dispatch(fetchCourse(courseId)),
  createQueue: (courseId, queue) => dispatch(createQueue(courseId, queue)),
})

export default withRedux(makeStore, mapStateToProps, mapDispatchToProps)(Page)
