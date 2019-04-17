import React, { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { useTheme } from './ThemeProvider'

const Footer = () => {
  const { isDarkMode } = useTheme()
  return (
    <Fragment>
      <div className="footer p-3 bg-light d-flex justify-content-center text-muted">
        <a href="https://github.com/illinois/queue" className="text-muted">
          <FontAwesomeIcon icon={faGithub} className="mr-2" />
          GitHub
        </a>
      </div>
      <style global jsx>{`
        .footer {
          position: absolute;
          bottom: 0;
          width: 100%;
        }
        .footer a {
          transition: 300ms all;
        }
        .footer a:hover,
        .footer a:focus {
          text-decoration: none;
          color: ${isDarkMode ? 'white' : 'black'} !important;
        }
      `}</style>
    </Fragment>
  )
}

export default Footer
