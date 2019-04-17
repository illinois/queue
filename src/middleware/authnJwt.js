const { ApiError } = require('../api/util')
const safeAsync = require('../middleware/safeAsync')
const { getUserFromJwt } = require('../auth/util')

module.exports = safeAsync(async (req, res, next) => {
  if (res.locals.userAuthn) {
    // Something else in the chain already handled authn
    next()
    return
  }

  const jwtCookie = req.cookies.jwt
  if (!jwtCookie) {
    // Maybe they authenticated a different way
    next()
    return
  }

  const user = await getUserFromJwt(jwtCookie)
  if (user === null) {
    // This shouldn't ever happen, but if it does...
    next(new ApiError(401, 'Invalid cookie'))
    return
  }

  res.locals.userAuthn = user
  next()
})
