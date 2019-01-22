const { withBaseUrl } = require('../util')

module.exports = (req, res) => {
  res.clearCookie('jwt')
  res.redirect(withBaseUrl('/'))
}
