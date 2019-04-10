import React from 'react'
import { Container } from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Loading = () => (
  <Container fluid className="text-center">
    <FontAwesomeIcon icon={faSpinner} pulse size="lg" className="my-3" />
  </Container>
)

export default Loading
