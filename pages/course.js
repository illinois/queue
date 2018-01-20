import Link from 'next/link'
import {
  Container,
  Row,
  Col
} from 'reactstrap'
import withRedux from 'next-redux-wrapper'

import makeStore from '../redux/makeStore'
import { requestCourse, fetchCourse } from '../actions/course'
import Layout from '../components/Layout'

class Page extends React.Component {
  componentDidMount() {
    this.props.fetchCourse(this.props.courseId)
  }

  static async getInitialProps({ isServer, store, query }) {
    if (isServer) {
      store.dispatch(requestCourse())
    }
    return { courseId: query.id }
  }

  render() {

    let content
    if (this.props.course) {
      content = (
        <div>{this.props.course.name} {this.props.course.id}</div>
      )
    } else {
      content = (
        <div>Loading...</div>
      )
    }
    return (
      <Layout>
        <Container fluid>
          <Row>
            <Col xs={{size: 12}} md={{size: 9}}>
              Hello!
              {content}
            </Col>
          </Row>
        </Container>
      </Layout>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    course: state.courses.courses[ownProps.courseId],
    isFetching: state.courses.isFetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCourse: (courseId) => dispatch(fetchCourse(courseId))
  }
}

export default withRedux(makeStore, mapStateToProps, mapDispatchToProps)(Page)
