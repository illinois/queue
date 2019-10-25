import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  ButtonGroup,
  FormGroup,
  Form,
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
} from '../actions/course'

import Error from '../components/Error'
import PageWithUser from '../components/PageWithUser'
import AddStaff from '../components/AddStaff'
import RemoveableUserItem from '../components/RemoveableUserItem'
import { withBaseUrl } from '../util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

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

  render() {
    if (this.props.isFetching) {
      return null
    }
    if (!this.props.isFetching && !this.props.course) {
      return <Error statusCode={404} />
    }

    const { courseId } = this.props
    var unlisted = this.props.course.isUnlisted

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
        <div className="d-flex flex-wrap align-items-center mb-4">
          <Container align="center">
            <Card className="staff-card">
              <CardHeader className="bg-primary text-white d-flex align-items-center">
                <CardTitle tag="h4" className="mb-0">
                  Change {this.props.course.name}'s Listing Status
                </CardTitle>
              </CardHeader>
              <Form fluid>
                <FormGroup
                  check
                  onClick={() => {
                    console.log(this.state)
                    unlisted = true
                  }}
                >
                  <Label check>
                    <Input type="radio" name="radio1" /> Unlisted
                  </Label>
                </FormGroup>
                <FormGroup
                  check
                  onClick={() => {
                    console.log(this.state)
                    unlisted = false
                  }}
                >
                  <Label check>
                    <Input type="radio" name="radio1" /> Listed
                  </Label>
                </FormGroup>
                <Button
                  onClick={() => this.updateUnlisted({ isUnlisted: unlisted })}
                >
                  Submit
                </Button>
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
  dispatch,
})

const permissions = { requireCourseStaff: true }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWithUser(CourseSettings, permissions))
