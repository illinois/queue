import React, { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

const Footer = () => (
  <Fragment>
    <footer className="footer p-3 bg-light d-flex justify-content-center text-muted">
      <a href="https://github.com/illinois/queue" className="text-muted">
        <FontAwesomeIcon icon={faGithub} className="mr-2" />
        GitHub
      </a>
    </footer>
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
        color: black !important;
      }
    `}</style>
  </Fragment>
)

export default Footer
