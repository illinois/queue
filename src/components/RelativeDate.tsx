import React, { useState, useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { formatDistanceToNow } from 'date-fns'

const formatDate = (date: Date) =>
  formatDistanceToNow(date, { addSuffix: true })

/**
 * Renders a relative date string like "in 3 minutes" or "2 days ago".
 */
const RelativeDate: React.FunctionComponent<{
  date: Date
}> = ({ date }) => {
  const [relativeDate, setRelativeDate] = useState(formatDate(date))
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRelativeDate(formatDate(date))
    }, 60000)
    return () => clearInterval(intervalId)
  }, [date])
  return <Fragment>{relativeDate}</Fragment>
}

RelativeDate.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
}

export default RelativeDate
