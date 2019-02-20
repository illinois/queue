import React from 'react'
import ReactMarkdown from 'react-markdown'

import ParrotText from './ParrotText'

const ParrotMarkdown = props => {
  const renderers = {
    text: element => <ParrotText text={element.children} />,
  }
  return <ReactMarkdown {...props} renderers={renderers} />
}

ParrotMarkdown.propTypes = ReactMarkdown.propTypes

export default ParrotMarkdown
