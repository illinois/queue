import React from 'react'
import { Alert } from 'reactstrap'
import moment from 'moment'

export default () => {
  // Hide ad once the event starts
  if (moment().isAfter('2018-04-24 19:00:00.000-05')) return null

  return (
    <Alert color="primary">
      <h6>Want to work on the queue?</h6>
      <p className="mb-0">
        Join us for a development workshop on Tuesday, April 24th at 7PM in
        Siebel 2405. We&apos;ll teach you how to run a version of the queue on
        your machine, introduce you to the architecture, go over how to
        contribute, and more!
        <a
          className="ml-2"
          href="https://www.facebook.com/events/352213225287320/"
        >
          More information
        </a>
      </p>
    </Alert>
  )
}
