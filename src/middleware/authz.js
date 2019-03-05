const { getAuthzForUser } = require('../auth/util')

module.exports = async (req, res, next) => {
  // Grab the user from the authentication stage
  const { userAuthn } = res.locals

  res.locals.userAuthz = await getAuthzForUser(userAuthn)

  next()
}
