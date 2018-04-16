/* eslint-env browser */
import React from 'react'
import PropTypes from 'prop-types'
import { baseUrl } from '../util'

/* eslint-disable react/prefer-stateless-function */
class CourseShortCodeInfo extends React.Component {
  render() {
    const { course } = this.props

    if (!course || !course.shortcode) return null

    const origin =
      (typeof window !== 'undefined' && window.location.origin) || ''
    const link = `${origin}${baseUrl}/${course.shortcode}`

    return (
      <div>
        <h4>Course shortcode URL</h4>
        <a href={link}>{link}</a>
        <p>
          This is a special link that you can use to easily reach the current
          queue. If there&apos;s exactly one queue open for this course, the
          link will redirect you to that queue. Otherwise, it will redirect you
          to the course&apos;s homepage.
        </p>
      </div>
    )
  }
}

CourseShortCodeInfo.defaultProps = {
  course: null,
}

CourseShortCodeInfo.propTypes = {
  course: PropTypes.shape({
    shortcode: PropTypes.string,
  }),
}

export default CourseShortCodeInfo
