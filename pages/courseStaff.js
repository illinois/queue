import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  ListGroup,
  ListGroupItem,
} from 'reactstrap'
import withRedux from 'next-redux-wrapper'
import FlipMove from 'react-flip-move'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'

import {
  fetchCourse,
  addCourseStaff,
  removeCourseStaff,
} from '../actions/course'
import makeStore from '../redux/makeStore'

import PageWithUser from '../components/PageWithUser'
import Layout from '../components/Layout'
import AddStaff from '../components/AddStaff'
import CourseStaffMember from '../components/CourseStaffMember'


class CourseStaff extends React.Component {
  static async getInitialProps({ isServer, query }) {
    return {
      isFetching: isServer,
      courseId: Number.parseInt(query.id, 10),
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      showAddStaffPanel: false,
    }
  }

  componentDidMount() {
    this.props.fetchCourse(this.props.courseId)
  }

  addStaff(staff) {
    const { netid, name } = staff
    const { courseId } = this.props
    this.props.addCourseStaff(courseId, netid, name).then(() => this.hideAddStaffPanel())
  }

  showAddStaffPanel() {
    this.setState({
      showAddStaffPanel: true,
    })
  }

  hideAddStaffPanel() {
    this.setState({
      showAddStaffPanel: false,
    })
  }

  render() {
    const { courseId } = this.props

    let content
    if (this.props.isFetching || !this.props.course || !this.props.course.staff) {
      content = (
        <Card className="staff-card">
          <CardBody className="text-center">
            <FontAwesomeIcon icon={faSpinner} pulse />
          </CardBody>
        </Card>
      )
    } else {
      let users
      if (this.props.course.staff && this.props.course.staff.length > 0) {
        users = this.props.course.staff.map((id) => {
          const user = this.props.users[id]
          return (
            <CourseStaffMember
              key={user.id}
              removeCourseStaff={userId => this.props.removeCourseStaff(courseId, userId)}
              {...user}
            />
          )
        })
      } else {
        users = (
          <div>
            <ListGroupItem className="text-center text-muted pt-4 pb-4">
              This course doesn&apos;t have any staff yet
            </ListGroupItem>
          </div>
        )
      }

      const addStaffButton = (
        <ListGroupItem action className="text-muted" onClick={() => this.showAddStaffPanel()}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add staff
        </ListGroupItem>
      )

      const addStaffPanel = (
        <AddStaff
          onAddStaff={staff => this.addStaff(staff)}
          onCancel={() => this.hideAddStaffPanel()}
        />
      )

      content = (
        <Card className="staff-card">
          <CardHeader className="bg-primary text-white d-flex align-items-center">
            <CardTitle tag="h4" className="mb-0">
              {this.props.course && this.props.course.name} Staff
            </CardTitle>
          </CardHeader>
          <ListGroup flush>
            <FlipMove
              enterAnimation="accordionVertical"
              leaveAnimation="accordionVertical"
              duration={200}
            >
              {users}
            </FlipMove>
            {!this.state.showAddStaffPanel && addStaffButton}
            {this.state.showAddStaffPanel && addStaffPanel}
          </ListGroup>
        </Card>
      )
    }

    return (
      <Layout>
        <Container fluid>
          {content}
        </Container>
        <style jsx>{`
          :global(.staff-card) {
            width: 100%;
            max-width: 500px;
            margin: auto;
          }
        `}</style>
      </Layout>
    )
  }
}

CourseStaff.defaultProps = {
  course: null,
}

CourseStaff.propTypes = {
  courseId: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
  fetchCourse: PropTypes.func.isRequired,
  addCourseStaff: PropTypes.func.isRequired,
  removeCourseStaff: PropTypes.func.isRequired,
  course: PropTypes.shape({
    name: PropTypes.string,
    staff: PropTypes.arrayOf(PropTypes.number),
  }),
  users: PropTypes.objectOf(PropTypes.shape({
    id: PropTypes.number,
    netid: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
}

const mapStateToProps = (state, { courseId }) => ({
  course: state.courses.courses[courseId],
  users: state.users.users,
  isFetching: state.courses.isFetching || state.users.isFetching,
})

const mapDispatchToProps = dispatch => ({
  fetchCourse: courseId => dispatch(fetchCourse(courseId)),
  addCourseStaff: (courseId, netid, name) => dispatch(addCourseStaff(courseId, netid, name)),
  removeCourseStaff: (courseId, userId) => dispatch(removeCourseStaff(courseId, userId)),
  dispatch,
})

const permissions = { requireCourseStaff: true }
export default withRedux(makeStore, mapStateToProps, mapDispatchToProps)(PageWithUser(CourseStaff, permissions))
