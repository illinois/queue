import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Col, Card, CardBody } from 'reactstrap'

import { Router } from '../routes'

import QueueCard from './QueueCard'
import QueueEdit from './QueueEdit'
import ConfirmDeleteQueueModal from './ConfirmDeleteQueueModal'

/* eslint-disable react/prefer-stateless-function */
class QueueCardList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showDeleteQueueModal: false,
      showEditQueueModal: false,
      pendingDeleteQueue: null,
      pendingEditQueueId: null,
    }
  }

  editQueue(queueId) {
    this.setState({
      showEditQueueModal: true,
      pendingEditQueueId: queueId,
    })
  }

  submitQueueEdit(attributes) {
    const { pendingEditQueueId } = this.state
    this.props.updateQueue(pendingEditQueueId, attributes).then(() => {
      this.setState({
        showEditQueueModal: false,
        pendingEditQueueId: null,
      })
    })
  }

  queueEditCancel() {
    this.setState({
      showEditQueueModal: false,
      pendingEditQueueId: null,
    })
  }

  deleteQueue(courseId, queueId) {
    this.setState({
      showDeleteQueueModal: true,
      pendingDeleteQueue: { courseId, queueId },
    })
  }

  confirmDeleteQueue() {
    const { courseId, queueId } = this.state.pendingDeleteQueue
    this.props.deleteQueue(courseId, queueId).then(() => {
      this.setState({
        showDeleteQueueModal: false,
        pendingDeleteQueue: null,
      })
    })
  }

  toggleDeleteModal() {
    this.setState(prevState => ({
      showDeleteQueueModal: !prevState.showDeleteQueueModal,
    }))
  }

  render() {
    const CardCol = ({ children, ...rest }) => (
      <Col
        xs={{ size: 12 }}
        md={{ size: 6 }}
        lg={{ size: 4 }}
        className="mb-3"
        {...rest}
      >
        {children}
      </Col>
    )

    let queues
    if (this.props.queueIds && this.props.queueIds.length > 0) {
      const handleQueueClick = id => {
        Router.pushRoute('queue', { id })
      }
      this.props.queueIds.sort((id1, id2) => {
        const queue1 = this.props.queues[id1]
        const courseName1 = this.props.courses[queue1.courseId].name
        const queue2 = this.props.queues[id2]
        const courseName2 = this.props.courses[queue2.courseId].name

        // compare the class name first
        if (courseName1 < courseName2) {
          return -1
        } else if (courseName1 > courseName2) {
          return 1
        } else {
          // if the class name are the same, compare queue name
          if (queue1.name < queue2.name) {
            return -1
          } else if (queue1.name > queue2.name) {
            return 2
          }
          return 0
        }
      })
      queues = this.props.queueIds.map(queueId => {
        const queue = this.props.queues[queueId]
        const courseName = this.props.courses[queue.courseId].name
        return (
          <CardCol key={queue.id}>
            <QueueCard
              queue={queue}
              open={this.props.openQueue}
              courseName={this.props.showCourseName ? courseName : null}
              onClick={() => handleQueueClick(queue.id)}
              onDelete={() => this.deleteQueue(queue.courseId, queue.id)}
              onUpdate={() => this.editQueue(queue.id)}
            />
          </CardCol>
        )
      })
    } else {
      queues = (
        <Col>
          <Card className="bg-light">
            <CardBody className="text-center">
              There aren&apos;t any {this.props.openQueue ? 'open' : 'closed'}{' '}
              queues right now
            </CardBody>
          </Card>
        </Col>
      )
    }

    return (
      <Fragment>
        {queues}
        <ConfirmDeleteQueueModal
          isOpen={this.state.showDeleteQueueModal}
          toggle={() => this.toggleDeleteModal()}
          confirm={() => this.confirmDeleteQueue()}
        />
        <QueueEdit
          queue={this.props.queues[this.state.pendingEditQueueId]}
          isOpen={this.state.showEditQueueModal}
          onSubmitQueueEdit={attributes => this.submitQueueEdit(attributes)}
          onCancel={() => this.queueEditCancel()}
        />
        <style global jsx>{`
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
      </Fragment>
    )
  }
}

QueueCardList.defaultProps = {
  queueIds: [],
  courses: {},
  queues: {},
  showCourseName: false,
  openQueue: true,
}

QueueCardList.propTypes = {
  queueIds: PropTypes.arrayOf(PropTypes.number),
  courses: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ),
  queues: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string,
      location: PropTypes.string,
    })
  ),
  showCourseName: PropTypes.bool,
  openQueue: PropTypes.bool,
  updateQueue: PropTypes.func.isRequired,
  deleteQueue: PropTypes.func.isRequired,
}

export default QueueCardList
