import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CustomInput,
  Button,
  Input,
} from 'reactstrap'
import { useBoolean, useInput } from 'react-hanger'

const AdmissionControlPanel = props => {
  const initialEnabled = false
  const enabledToggle = useBoolean(initialEnabled)
  const admissionControlUrl = useInput('wig')
  const changed = enabledToggle.value !== initialEnabled
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
        <div>
          <CustomInput
            id="messageEnabled"
            type="switch"
            className="mr-3 d-inline-block"
            onChange={enabledToggle.toggle}
            checked={enabledToggle.value}
          />
          Custom admission control policy is{' '}
          {enabledToggle.value ? 'enabled' : 'disabled'}
        </div>
        <Input
          {...admissionControlUrl.bindToInput}
          disabled={!enabledToggle.value}
        />
        <Button disabled={!changed} color="primary">
          Update
        </Button>
      </CardBody>
    </Card>
  )
}

export default AdmissionControlPanel
