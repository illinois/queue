const { withBaseUrl, isDev } = require('../util')

module.exports = (req, res) => {
  res.clearCookie('jwt')
  // When we're running in prod, do another redirect to Shib to complete the
  // signout process. Locally, just send them back to the login page.
  if (isDev) {
    res.redirect(withBaseUrl('/login'))
  } else {
    res.redirect('/Shibboleth.sso/Logout')
  }
}
