import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  Input,
  Form,
  FormGroup,
  Label,
  Col,
} from 'reactstrap'
import { useInput } from 'react-hanger'

interface GeneralPanelProps {
  queue: {
    name: string
    location: string
  }
  updateQueue: (queue: { name: string; location: string }) => void
}

const GeneralPanel = ({ queue, updateQueue }: GeneralPanelProps) => {
  const name = useInput(queue.name)
  const location = useInput(queue.location)
  const changed = name.value !== queue.name || location.value !== queue.location

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateQueue({
      name: name.value,
      location: location.value,
    })
  }

  return (
    <Card className="mb-3">
      <CardHeader>
        <CardTitle tag="h5" className="mb-0">
          General
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Form autoComplete="off" onSubmit={onSubmit}>
          <FormGroup row>
            <Label for="name" sm={3}>
              Name
            </Label>
            <Col sm={9}>
              <Input id="name" {...name.bindToInput} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="location" sm={3}>
              Location
            </Label>
            <Col sm={9}>
              <Input id="location" {...location.bindToInput} />
            </Col>
          </FormGroup>
          <Button disabled={!changed} color="primary" type="submit">
            Update
          </Button>
        </Form>
      </CardBody>
    </Card>
  )
}

GeneralPanel.propTypes = {
  queue: PropTypes.shape({
    admissionControlUrl: PropTypes.string,
    admissionControlEnabled: PropTypes.bool,
  }).isRequired,
  updateQueue: PropTypes.func.isRequired,
}

export default GeneralPanel
