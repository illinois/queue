import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { ListGroupItem, Button, Badge } from 'reactstrap'
import Moment from 'react-moment'
import moment from 'moment'

import ParrotText from './ParrotText'

/* eslint-disable react/prefer-stateless-function */
class Question extends React.Component {
  render() {
    const {
      id,
      name,
      location,
      topic,
      beingAnswered,
      enqueueTime,
      answeredBy,
      askedBy,
      isUserCourseStaff,
      isUserActiveStaffForQueue,
      isUserAnsweringQuestion,
      isUserAnsweringOtherQuestion,
      didUserAskQuestion,
    } = this.props

    const userCanDelete = didUserAskQuestion || isUserCourseStaff

    let buttonCluster
    if (beingAnswered) {
      if (isUserCourseStaff && isUserAnsweringQuestion) {
        buttonCluster = (
          <Fragment>
            <Button
              color="primary"
              className="mr-2"
              onClick={() => this.props.finishedAnswering(id)}
            >
              Finish Answering
            </Button>
            <Button color="light" onClick={() => this.props.cancelQuestion()}>
              Stop Answering
            </Button>
          </Fragment>
        )
      } else if (isUserCourseStaff && !isUserAnsweringQuestion) {
        buttonCluster = (
          <Fragment>
            <Button color="light" onClick={() => this.props.cancelQuestion()}>
              Interrupt
            </Button>
          </Fragment>
        )
      } else {
        buttonCluster = userCanDelete ? (
          <Button
            color="danger"
            outline
            onClick={() => this.props.deleteQuestion()}
          >
            Delete
          </Button>
        ) : null
      }
    } else {
      buttonCluster = (
        <Fragment>
          {isUserActiveStaffForQueue && !isUserAnsweringOtherQuestion && (
            <Button
              color="primary"
              outline
              className="mr-2"
              onClick={() => this.props.startQuestion()}
            >
              Start Answering!
            </Button>
          )}
          {didUserAskQuestion && (
            <Button
              color="primary"
              outline
              className="mr-2"
              onClick={() => this.props.editQuestion(id)}
            >
              Edit
            </Button>
          )}
          {userCanDelete && (
            <Button
              color="danger"
              outline
              onClick={() => this.props.deleteQuestion()}
            >
              Delete
            </Button>
          )}
        </Fragment>
      )
    }

    const isBeingAnswered = !!answeredBy
    const answeringName =
      (answeredBy && (answeredBy.name || answeredBy.uid)) || undefined

    return (
      <Fragment>
        <ListGroupItem key={id} className="d-sm-flex align-items-center">
          <div
            style={{
              height: '100%',
              position: 'absolute',
              top: '0',
              left: '0',
            }}
          >
            {didUserAskQuestion && (
              <div
                style={{
                  height: '100%',
                  width: '5px',
                  float: 'left',
                }}
                className="bg-primary"
              />
            )}
            {isBeingAnswered && (
              <div
                style={{
                  height: '100%',
                  width: '5px',
                  float: 'left',
                }}
                className="bg-success"
              />
            )}
          </div>
          <div>
            {isBeingAnswered && (
              <Badge color="success">Being answered by {answeringName}</Badge>
            )}
            <strong className="d-block">
              <span title="Name">{name}</span>
              {isUserCourseStaff && (
                <span title="UID" className="text-muted">
                  {' '}
                  ({askedBy.uid})
                </span>
              )}
            </strong>
            <div className="text-muted">
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                {!!location && (
                  <Fragment>
                    <span title="Location">{location}</span>
                    <span className="mr-2 ml-2">&bull;</span>
                  </Fragment>
                )}
                <span title={moment(enqueueTime).calendar()}>
                  <Moment fromNow>{enqueueTime}</Moment>
                </span>
              </span>
            </div>
            <div title="Topic">
              <ParrotText text={topic} />
            </div>
          </div>
          <div className="ml-auto pt-3 pt-sm-0">{buttonCluster}</div>
        </ListGroupItem>
      </Fragment>
    )
  }
}

Question.defaultProps = {
  answeredBy: null,
}

Question.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  beingAnswered: PropTypes.bool.isRequired,
  enqueueTime: PropTypes.string.isRequired,
  answeredBy: PropTypes.shape({
    name: PropTypes.string,
    uid: PropTypes.string,
  }),
  askedBy: PropTypes.shape({
    uid: PropTypes.string,
  }).isRequired,
  didUserAskQuestion: PropTypes.bool.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
  isUserActiveStaffForQueue: PropTypes.bool.isRequired,
  isUserAnsweringQuestion: PropTypes.bool.isRequired,
  isUserAnsweringOtherQuestion: PropTypes.bool.isRequired,
  cancelQuestion: PropTypes.func.isRequired,
  startQuestion: PropTypes.func.isRequired,
  editQuestion: PropTypes.func.isRequired,
  finishedAnswering: PropTypes.func.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
}

export default Question
