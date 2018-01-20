import Link from 'next/link'
import {
  Container,
  Row,
  Col
} from 'reactstrap'
import withRedux from 'next-redux-wrapper'

import makeStore from '../redux/makeStore'
import Layout from '../components/Layout'
import StaffSidebar from '../components/StaffSidebar'
import NewQuestionContainer from '../containers/NewQuestionContainer'
import QuestionListContainer from '../containers/QuestionListContainer'

const Page = (props) => (
  <Layout>
    <Container fluid>
      <Row>
        <Col xs={{size: 12}} md={{size: 3}}>
          <StaffSidebar />
        </Col>
        <Col xs={{size: 12}} md={{size: 9}}>
          <NewQuestionContainer queueId={props.queueId} />
          <QuestionListContainer queueId={props.queueId} />
        </Col>
      </Row>
    </Container>
  </Layout>
)

Page.getInitialProps = function({query}) {
  return { queueId: query.id }
}

export default withRedux(makeStore)(Page)
