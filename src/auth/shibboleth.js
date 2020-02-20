const { withBaseUrl } = require('../util')
const { createOrUpdateUser, addJwtCookie, isSafeUrl } = require('./util')
const safeAsync = require('../middleware/safeAsync')

module.exports = safeAsync(async (req, res) => {
  // Get the user's email based on the "eppn" header
  const uid = req.get('eppn') || req.get('edupersonprincipalname') || ''
  if ('EPPN_SUFFIX' in process.env && !uid.endsWith(process.env.EPPN_SUFFIX)) {
    res.status(400).send('No login information found')
    return
  }

  const user = await createOrUpdateUser(req, uid)
  addJwtCookie(req, res, user)

  const { redirect } = req.query
  // Sanity check the redirect url
  // Finally, we'll redirect the user to either their original url or the queue homepage.
  // The redirect should already be prefixed by `BASE_URL`
  // They'll now have the required token to make authenticated requests.
  if (redirect && isSafeUrl(req, redirect)) {
    res.redirect(redirect)
  } else {
    res.redirect(withBaseUrl('/'))
  }
})
