import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CustomInput,
  Button,
  Input,
  Form,
  FormGroup,
  Label,
  Col,
} from 'reactstrap'
import { useBoolean, useInput } from 'react-hanger'

const AdmissionControlPanel = ({ queue, updateQueue }) => {
  const admissionControlUrl = queue.admissionControlUrl || ''
  const enabledToggle = useBoolean(queue.admissionControlEnabled)
  const admissionControlUrlInput = useInput(admissionControlUrl)
  const changed =
    enabledToggle.value !== queue.admissionControlEnabled ||
    admissionControlUrlInput.value !== admissionControlUrl

  const onSubmit = e => {
    e.preventDefault()
    updateQueue({
      admissionControlEnabled: enabledToggle.value,
      admissionControlUrl: admissionControlUrlInput.value,
    })
  }

  return (
    <Card className="mb-3">
      <CardHeader>
        <CardTitle tag="h5" className="mb-0">
          Admission control
        </CardTitle>
      </CardHeader>
      <CardBody>
        <p>
          You can set a programmatic admission control policy for your queue.
          This allows you to disallow questions based on topic, rate-limit
          students on the queue, or even maintain a blacklist of queue users.
          For more information, check out the{' '}
          <a href="https://github.com/illinois/queue/blob/master/doc/AdmissionControl.md">
            admission control docs.
          </a>
        </p>
        <Form autoComplete="off" onSubmit={onSubmit}>
          <FormGroup row>
            <Label for="enable" sm={3}>
              Enable custom policy
            </Label>
            <Col sm={9} className="d-flex align-items-center">
              <CustomInput
                id="enable"
                type="switch"
                className="mr-3 d-inline-block"
                onChange={enabledToggle.toggle}
                checked={enabledToggle.value}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="url" sm={3}>
              Policy API URL
            </Label>
            <Col sm={9}>
              <Input
                id="url"
                type="url"
                {...admissionControlUrlInput.bindToInput}
                disabled={!enabledToggle.value}
              />
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

AdmissionControlPanel.propTypes = {
  queue: PropTypes.shape({
    admissionControlUrl: PropTypes.string,
    admissionControlEnabled: PropTypes.bool,
  }).isRequired,
  updateQueue: PropTypes.func.isRequired,
}

export default AdmissionControlPanel
