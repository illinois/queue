import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { withBaseUrl } from '../util'

const parrots = {
  fastparrot: withBaseUrl('/static/fastparrot.gif'),
}

const ParrotText = ({ text }) => {
  if (!text) return ''

  const textComponents = text.split(/:([a-zA-Z_0-9]+):/)
  const mapped = textComponents.map((c, i) => {
    if (i % 2 === 0) return c
    // Replace the original colons if this isn't a valid parrot
    if (!(c in parrots)) return `:${c}:`
    return (
      <img
        src={parrots[c]}
        alt={c}
        key={`${c}_${i + 1}`}
        style={{ height: '1rem', marginTop: '-0.2rem' }}
      />
    )
  })
  return (
    <Fragment>
      {mapped}
    </Fragment>
  )
}

ParrotText.propTypes = {
  text: PropTypes.string.isRequired,
}

export default ParrotText
