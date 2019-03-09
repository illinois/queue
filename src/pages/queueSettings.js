import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Button,
} from 'reactstrap'
import { connect } from 'react-redux'

import { fetchQueue, fetchQueueRequest, updateQueue } from '../actions/queue'
import GeneralPanel from '../components/queueSettings/GeneralPanel'
import AdmissionControlPanel from '../components/queueSettings/AdmissionControlPanel'
import PageWithUser from '../components/PageWithUser'

class QueueSettings extends React.Component {
  static async getInitialProps({ isServer, store, query }) {
    const queueId = Number.parseInt(query.id, 10)
    if (isServer) {
      store.dispatch(fetchQueueRequest(queueId))
    }
    return {
      queueId,
      isFetching: isServer,
    }
    // Nothing to do at the moment
  }

  componentDidMount() {
    this.props.fetchQueue(this.props.queueId).then(() => {
      if (this.props.pageTransitionReadyToEnter) {
        this.props.pageTransitionReadyToEnter()
      }
    })
  }

  updateQueue(attributes) {
    this.props.updateQueue(this.props.queueId, attributes)
  }

  render() {
    if (!this.props.queue) return null
    return (
      <Container>
        <h1 className="display-4 mb-4">Queue Settings</h1>
        <GeneralPanel
          queue={this.props.queue}
          updateQueue={attributes => this.updateQueue(attributes)}
        />
        <AdmissionControlPanel
          queue={this.props.queue}
          updateQueue={attributes => this.updateQueue(attributes)}
        />
        <Card className="border border-danger">
          <CardHeader className="bg-danger text-white">
            <CardTitle tag="h5" className="mb-0">
              Danger zone
            </CardTitle>
            <small>Here be dragons</small>
          </CardHeader>
          <ListGroup>
            <ListGroupItem className="d-flex align-items-sm-center flex-column flex-sm-row">
              <div className="mr-auto pr-3">
                <strong>Delete this queue</strong>
                <p className="mb-0">
                  Deleting a queue is permanent; please be sure you want to do
                  this.
                </p>
              </div>
              <Button outline color="danger" className="mt-3 mt-sm-0">
                Delete&nbsp;queue
              </Button>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </Container>
    )
  }
}

QueueSettings.propTypes = {
  fetchQueue: PropTypes.func.isRequired,
  updateQueue: PropTypes.func.isRequired,
  queueId: PropTypes.number.isRequired,
  queue: PropTypes.shape({
    admissionControlEnabled: PropTypes.bool,
    admissionControlUrl: PropTypes.string,
  }).isRequired,
  pageTransitionReadyToEnter: PropTypes.func,
}

QueueSettings.defaultProps = {
  pageTransitionReadyToEnter: null,
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.queues.isFetching,
  hasQueue: !!state.queues.queues[ownProps.queueId],
  queue: state.queues.queues[ownProps.queueId],
})

const mapDispatchToProps = dispatch => ({
  fetchQueue: queueId => dispatch(fetchQueue(queueId)),
  updateQueue: (queueId, attributes) =>
    dispatch(updateQueue(queueId, attributes)),
  dispatch,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWithUser(QueueSettings))