import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

const HeadTitle = ({ title }) => {
  return (
    <Head>
      <title>
        {title || ''}
        {title && ' | '}Queue@Illinois
      </title>
    </Head>
  )
}

HeadTitle.propTypes = {
  title: PropTypes.string,
}

HeadTitle.defaultProps = {
  title: '',
}

export default HeadTitle
