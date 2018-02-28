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
      isUserAnsweringQuestion,
      didUserAskQuestion,
    } = this.props

    const userCanDelete = didUserAskQuestion || isUserCourseStaff

    let buttonCluster
    if (beingAnswered) {
      if (isUserCourseStaff) {
        buttonCluster = (
          <Fragment>
            {isUserAnsweringQuestion && (
              <Button
                color="primary"
                className="mr-2"
                onClick={() => this.props.finishedAnswering(id)}
              >
                Finish Answering
              </Button>
            )}
            <Button
              color="light"
              onClick={() => this.props.updateQuestionBeingAnswered(id, false)}
            >
              Cancel
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
          {isUserCourseStaff && (
            <Button
              color="primary"
              outline
              className="mr-2"
              onClick={() => this.props.updateQuestionBeingAnswered(id, true)}
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
<<<<<<< HEAD
    const answeringName =
      (answeredBy && (answeredBy.name || answeredBy.netid)) || undefined

=======
    const answeringName = (answeredBy && (answeredBy.name || answeredBy.netid)) || undefined
>>>>>>> show netid next to student name
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
            }
            <strong className="d-block">{name}
              {isUserCourseStaff &&
                <span className="text-muted"> ({askedBy.netid}) </span>
               }
            </strong>
            <div className="text-muted">
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                <span title="Location">{location}</span>
                <span className="mr-2 ml-2">&bull;</span>
                <span title={moment(enqueueTime).calendar()}>
                  <Moment fromNow>{enqueueTime}</Moment>
                </span>
              </span>
            </div>
            <div>
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
  askedBy: null,
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
    netid: PropTypes.string,
  }),
  askedBy: PropTypes.shape({
    netid: PropTypes.string,
  }),
  didUserAskQuestion: PropTypes.bool.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
  isUserAnsweringQuestion: PropTypes.bool.isRequired,
  updateQuestionBeingAnswered: PropTypes.func.isRequired,
  editQuestion: PropTypes.func.isRequired,
  finishedAnswering: PropTypes.func.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
}

export default Question
