import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Col, Card, CardBody } from 'reactstrap'

import { Router } from '../routes'

import QueueCard from './QueueCard'

const QueueCardList = props => {
  const queueSorter = (l, r) => {
    const queueL = props.queues[l]
    const queueR = props.queues[r]
    const courseNameL = props.courses[queueL.courseId].name.toLowerCase()
    const courseNameR = props.courses[queueR.courseId].name.toLowerCase()

    if (courseNameL === courseNameR) {
      const queueNameL = props.queues[l].name.toLowerCase()
      const queueNameR = props.queues[r].name.toLowerCase()

      if (queueNameL < queueNameR) {
        return -1
      }
      if (queueNameL > queueNameR) {
        return 1
      }
      return 0
    }

    if (courseNameL < courseNameR) {
      return -1
    }

    return 1
  }

  // eslint-disable-next-line react/prop-types
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
  if (props.queueIds && props.queueIds.length > 0) {
    const handleQueueClick = id => {
      Router.pushRoute('queue', { id })
    }

    const handleQueueKeyPress = (e, id) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleQueueClick(id)
      }
    }

    props.queueIds.sort(queueSorter)

    queues = props.queueIds.map(queueId => {
      const queue = props.queues[queueId]
      const courseName = props.courses[queue.courseId].name
      return (
        <CardCol key={queue.id}>
          <QueueCard
            queue={queue}
            open={props.openQueue}
            courseName={props.showCourseName ? courseName : null}
            onClick={() => handleQueueClick(queue.id)}
            onKeyPress={e => handleQueueKeyPress(e, queue.id)}
            tabIndex="0"
          />
        </CardCol>
      )
    })
  } else {
    queues = (
      <Col>
        <Card className="bg-light">
          <CardBody className="text-center">
            There aren&apos;t any {props.openQueue ? 'open' : 'closed'} queues
            right now
          </CardBody>
        </Card>
      </Col>
    )
  }

  return (
    <Fragment>
      {queues}
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
}

export default QueueCardList
