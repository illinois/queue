import React from 'react'
import { Container } from 'reactstrap'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'

import Layout from './Layout'

const Loading = () => (
  <Layout>
    <Container fluid className="text-center">
      <FontAwesomeIcon icon={faSpinner} pulse size="lg" className="mt-4" />
    </Container>
  </Layout>
)

export default Loading
