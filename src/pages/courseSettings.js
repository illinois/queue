import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  CustomInput,
  Col,
  FormText,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
  Card,
  CardHeader,
  CardTitle,
  ListGroup,
  ListGroupItem,
} from 'reactstrap'
import { connect } from 'react-redux'
import FlipMove from 'react-flip-move'

import {
  fetchCourse,
  fetchCourseRequest,
  addCourseStaff,
  removeCourseStaff,
  updateUnlistedCourse,
  updateQuestionFeedback,
} from '../actions/course'

import Error from '../components/Error'
import PageWithUser from '../components/PageWithUser'
import AddStaff from '../components/AddStaff'
import RemoveableUserItem from '../components/RemoveableUserItem'
import { withBaseUrl } from '../util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import ShowForAdmin from '../components/ShowForAdmin'

class CourseSettings extends React.Component {
  static async getInitialProps({ isServer, store, query }) {
    const courseId = Number.parseInt(query.id, 10)
    if (isServer) {
      store.dispatch(fetchCourseRequest(courseId))
    }
    return {
      courseId,
      isFetching: isServer,
    }
  }

  static pageTransitionDelayEnter = true

  componentDidMount() {
    this.props.fetchCourse(this.props.courseId).then(() => {
      if (this.props.pageTransitionReadyToEnter) {
        this.props.pageTransitionReadyToEnter()
      }
    })
  }

  addStaff(staff) {
    const { netid, name } = staff
    const { courseId } = this.props
    this.props.addCourseStaff(courseId, netid, name)
  }

  updateUnlisted(isUnlisted) {
    const { courseId } = this.props
    this.props.updateUnlistedCourse(courseId, isUnlisted)
  }

  updateQuestionFeedback(questionFeedback) {
    const { courseId } = this.props
    this.props.updateQuestionFeedback(courseId, questionFeedback)
  }

  render() {
    if (this.props.isFetching) {
      return null
    }
    if (!this.props.isFetching && !this.props.course) {
      return <Error statusCode={404} />
    }

    const { courseId } = this.props

    let users
    if (this.props.course.staff && this.props.course.staff.length > 0) {
      users = this.props.course.staff.map(id => {
        const user = this.props.users[id]
        return (
          <RemoveableUserItem
            key={user.id}
            onRemove={userId => this.props.removeCourseStaff(courseId, userId)}
            {...user}
          />
        )
      })
    } else {
      users = (
        <ListGroupItem className="text-center text-muted pt-4 pb-4">
          This course doesn&apos;t have any staff yet
        </ListGroupItem>
      )
    }

    return (
      <Fragment>
        <div className="d-flex flex-wrap align-items-center mb-4">
          <Container align="center">
            <h1 className="display-4">{this.props.course.name} Settings</h1>
            <Card className="staff-card">
              <CardHeader className="bg-primary text-white d-flex align-items-center">
                <CardTitle tag="h4" className="mb-0">
                  Manage {this.props.course && this.props.course.name} Staff
                </CardTitle>
              </CardHeader>
              <ListGroup flush className="position-relative">
                <AddStaff onAddStaff={staff => this.addStaff(staff)} />
                <FlipMove
                  enterAnimation="accordionVertical"
                  leaveAnimation="accordionVertical"
                  duration={200}
                  typeName={null}
                >
                  {users}
                </FlipMove>
              </ListGroup>
            </Card>
          </Container>
        </div>
        <ShowForAdmin>
          <div className="d-flex flex-wrap align-items-center mb-4">
            <Container>
              <Card className="staff-card">
                <CardHeader className="bg-primary text-white d-flex align-items-center">
                  <CardTitle tag="h4" className="mb-0">
                    Change {this.props.course.name}'s Listing
                  </CardTitle>
                </CardHeader>
                <Form>
                  <Col sm={9}>
                    <CustomInput
                      id="isUnlisted"
                      type="switch"
                      name="isUnlisted"
                      defaultChecked={this.props.course.isUnlisted}
                      onChange={e =>
                        this.updateUnlisted({ isUnlisted: e.target.checked })
                      }
                    />
                    <FormText color="muted">
                      Making your course unlisted will only allow students with
                      the course shortcode to view this course.
                    </FormText>
                  </Col>
                </Form>
              </Card>
            </Container>
          </div>
        </ShowForAdmin>

        <div className="d-flex flex-wrap align-items-center mb-4">
          <Container>
            <Card className="staff-card">
              <CardHeader className="bg-primary text-white d-flex align-items-center">
                <CardTitle tag="h4" className="mb-0">
                  Show Question Feedback Form
                </CardTitle>
              </CardHeader>
              <Form>
                <Col sm={9}>
                  <CustomInput
                    id="questionFeedback"
                    type="switch"
                    name="questionFeedback"
                    defaultChecked={this.props.course.questionFeedback}
                    onChange={e =>
                      this.updateQuestionFeedback({
                        questionFeedback: e.target.checked,
                      })
                    }
                  />
                  <FormText color="muted">
                    Allowing question feedback will let your course staff
                    provide feedback after answering each student's question.
                  </FormText>
                </Col>
              </Form>
            </Card>
          </Container>
        </div>

        <div className="d-flex flex-wrap align-items-center mb-4">
          <Container align="center">
            <Button
              color="primary"
              align="center"
              href={withBaseUrl(`/api/courses/${courseId}/data/questions`)}
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Download Queue Data
            </Button>
          </Container>
        </div>
        <style jsx>{`
          :global(.staff-card) {
            width: 100%;
            max-width: 500px;
            margin: auto;
          }
        `}</style>
      </Fragment>
    )
  }
}

CourseSettings.propTypes = {
  courseId: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
  fetchCourse: PropTypes.func.isRequired,
  addCourseStaff: PropTypes.func.isRequired,
  removeCourseStaff: PropTypes.func.isRequired,
  updateUnlistedCourse: PropTypes.func.isRequired,
  updateQuestionFeedback: PropTypes.func.isRequired,
  course: PropTypes.shape({
    name: PropTypes.string,
    staff: PropTypes.arrayOf(PropTypes.number),
  }),
  users: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number,
      netid: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
  pageTransitionReadyToEnter: PropTypes.func,
}

CourseSettings.defaultProps = {
  course: null,
  pageTransitionReadyToEnter: null,
}

const mapStateToProps = (state, { courseId }) => ({
  course: state.courses.courses[courseId],
  users: state.users.users,
  isFetching: state.courses.isFetching || state.users.isFetching,
})

const mapDispatchToProps = dispatch => ({
  fetchCourse: courseId => dispatch(fetchCourse(courseId)),
  addCourseStaff: (courseId, netid, name) =>
    dispatch(addCourseStaff(courseId, netid, name)),
  removeCourseStaff: (courseId, userId) =>
    dispatch(removeCourseStaff(courseId, userId)),
  updateUnlistedCourse: (courseId, isUnlisted) =>
    dispatch(updateUnlistedCourse(courseId, isUnlisted)),
  updateQuestionFeedback: (courseId, questionFeedback) =>
    dispatch(updateQuestionFeedback(courseId, questionFeedback)),
  dispatch,
})

const permissions = { requireCourseStaff: true }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWithUser(CourseSettings, permissions))
