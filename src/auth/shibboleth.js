const { withBaseUrl } = require('../util')
const { createOrUpdateUser, addJwtCookie } = require('./util')
const safeAsync = require('../middleware/safeAsync')

module.exports = safeAsync(async (req, res) => {
  // Get the user's NetID based on the "eppn" header
  const email = req.get('eppn') || ''
  if (email.indexOf('@') === -1) {
    res.status(400).send('No login information found')
    return
  }
  const [netid] = email.split('@')

  const user = await createOrUpdateUser(req, netid)
  addJwtCookie(req, res, user)

  // Finally, we'll redirect the user to the queue homepage. They'll now
  // have the required token to make authenticated requests.
  res.redirect(withBaseUrl('/'))
})
