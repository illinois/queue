const safeAsync = require('../middleware/safeAsync')
const { User } = require('../models')

/**
 * This is used during testing to easily test API routes with different
 * permissions.
 *
 * DO NOT LET THIS ROUTE BE SERVED IN PRODUCTION.
 */
module.exports = safeAsync(async (req, res, next) => {
  const netid = req.query.forceuser || 'dev'
  const [user] = await User.findOrCreate({ where: { netid } })
  res.locals.userAuthn = user
  next()
})
