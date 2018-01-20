import {Link} from '../routes'
import {
  Container,
  Col,
  ListGroup,
  ListGroupItem,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  Button
} from 'reactstrap'
import withRedux from 'next-redux-wrapper'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'

import makeStore from '../redux/makeStore'
import { requestCourse, fetchCourse } from '../actions/course'
import { createQueue } from '../actions/queue'
import Layout from '../components/Layout'

class Page extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showCreateQueuePanel: false,
      name: '',
      location: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleCreateQueue = this.handleCreateQueue.bind(this)
  }

  static async getInitialProps({ isServer, store, query }) {
    if (isServer) {
      store.dispatch(requestCourse())
    }
    return {
      courseId: query.id
    }
  }

  componentDidMount() {
    this.props.fetchCourse(this.props.courseId)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleCreateQueue() {
    const queue = {
      name: this.state.name,
      location: this.state.location
    }

    this.props.createQueue(this.props.courseId, queue)
  }

  showCreateQueuePanel() {
    this.setState({
      showCreateQueuePanel: true
    })
  }

  hideCreateQueuePanel() {
    this.setState({
      showCreateQueuePanel: false
    })
  }

  render() {
    let queues
    if (this.props.course && this.props.course.queues && this.props.queues) {
      queues = this.props.course.queues.map(id => {
        const queue = this.props.queues[id]
        return (
          <Link route='queue' params={{id}} key={id} passHref>
            <ListGroupItem tag="a" action>{queue.name}</ListGroupItem>
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
                  value={this.state.name} />
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
                  value={this.state.location} />
                <FormText color="muted">
                  Setting a location is optional!
                </FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md={6}>
                <Button block color="secondary" type="button" onClick={this.hideCreateQueuePanel.bind(this)}>Cancel</Button>
              </Col>
              <Col md={6}>
                <Button block color="primary" type="button" onClick={this.handleCreateQueue}>Create</Button>
              </Col>
            </FormGroup>
          </Form>
        </ListGroupItem>
      )
    }

    let createQueueButton = (
      <ListGroupItem action className="text-muted" onClick={this.showCreateQueuePanel.bind(this)}>
        <FontAwesomeIcon icon={faPlus} className="mr-2"/>
        Create a queue
      </ListGroupItem>
    )

    return (
      <Layout>
        <Container fluid>
          <Card className="courses-card">
            <CardBody>
              <CardTitle tag="h3">{this.props.course && this.props.course.name}</CardTitle>
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

const mapStateToProps = (state, ownProps) => {
  const course = state.courses.courses[ownProps.courseId]
  return {
    course,
    queues: state.queues.queues,
    isFetching: state.courses.isFetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCourse: (courseId) => dispatch(fetchCourse(courseId)),
    createQueue: (courseId, queue) => dispatch(createQueue(courseId, queue))
  }
}

export default withRedux(makeStore, mapStateToProps, mapDispatchToProps)(Page)
