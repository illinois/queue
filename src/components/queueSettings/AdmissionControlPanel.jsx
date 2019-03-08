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

const AdmissionControlPanel = ({ queue, updateAdmissionControl }) => {
  const enabledToggle = useBoolean(queue.admissionControlEnabled)
  const admissionControlUrl = useInput(queue.admissionControlUrl)
  const changed =
    enabledToggle.value !== queue.admissionControlEnabled ||
    admissionControlUrl.value !== queue.admissionControlUrl

  const update = () => {
    updateAdmissionControl({
      admissionControlEnabled: enabledToggle.value,
      admissionControlUrl: admissionControlUrl.value,
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
          <a href="https://queue.illinois.edu">admission control docs.</a>
        </p>
        <Form autoComplete="off">
          <FormGroup row>
            <Label for="enable" sm={3}>
              Enable custom policy
            </Label>
            <Col sm={9} className="d-flex align-items-center">
              <CustomInput
                id="messageEnabled"
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
                {...admissionControlUrl.bindToInput}
                disabled={!enabledToggle.value}
              />
            </Col>
          </FormGroup>
        </Form>
        <Button disabled={!changed} color="primary" onClick={update}>
          Update
        </Button>
      </CardBody>
    </Card>
  )
}

AdmissionControlPanel.propTypes = {
  queue: PropTypes.shape({
    admissionControlUrl: PropTypes.string,
    admissionControlEnabled: PropTypes.bool,
  }),
  updateAdmissionControl: PropTypes.func.isRequired,
}

AdmissionControlPanel.defaultProps = {
  queue: null,
}

export default AdmissionControlPanel
