const { createOrUpdateUser, addJwtCookie } = require('./util')
const safeAsync = require('../middleware/safeAsync')

/**
 * This is used for user impersonation during local dev; it trusts that the
 * client is allowed to become the specified user.
 * 
 * DO NOT LET THIS ROUTE BE SERVED IN PRODUCTION.
 */
module.exports = safeAsync(async (req, res) => {
  const {
    body: { netid },
  } = req

  const user = await createOrUpdateUser(req, netid)
  addJwtCookie(req, res, user)

  res.status(200).send()
})
