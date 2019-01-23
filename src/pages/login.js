import React, { Fragment } from 'react'

import { Button  } from 'reactstrap'

import DevModeLogin from '../components/DevModeLogin'
import { withBaseUrl, isDev } from '../util'

const Login = () => {
  return (
    <Fragment>
      <div className="login-container">
        <h1 className="text-center display-4">Log in</h1>
        <p className="text-center text-secondary">
          Welcome back! Log in to access the Queue.
        </p>
        <Button
          className="btn-illinois"
          color={null}
          block
          href={withBaseUrl('/login/shib')}
        >
          Log in with Illinois
        </Button>
        {isDev && <hr />}
        {isDev && <DevModeLogin />}
      </div>
      <style jsx global>{`
        .login-container {
          margin-top:
          width: 100%;
          margin-right: auto;
          margin-left: auto;
          max-width: 500px;
          padding: 2rem;
          background-color: white;
        }
        @media (min-width: 576px) {
          body {
            background-color: var(--dark)!important;
          }
          .login-container {
            margin-top: 3rem;
            border-radius: 0.5rem;
            border: 1px solid white;
            box-shadow: 0px 6px 33px 2px rgba(0,0,0,0.36);
          }
        }
        .btn.btn-illinois {
          background-color: #E84A27;
          border-color: #E84A27;
          color: white;
        }
        .btn.btn-illinois:hover {
          background-color: #D04223;
          border-color: #D04223;
          color: white;
        }
        .btn.btn-illinois:focus {
          box-shadow: 0 0 0 0.2rem rgba(255, 83, 0, 0.35);
        }
        .btn.btn-illinois:active {
          background-color: #B93B1F;
          border-color: #B93B1F;
        }
      `}</style>
    </Fragment>
  )
}

export default Login