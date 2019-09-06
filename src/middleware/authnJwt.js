const { ApiError } = require('../api/util')
const safeAsync = require('../middleware/safeAsync')
const { getUserFromJwt, addJwtCookie } = require('../auth/util')

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

  // This was done as a part of https://github.com/illinois/queue/pull/284 to
  // quickly validate that our fix was working; otherwise we'd have to wait a
  // month before seeing results since that's the maximum length of time that
  // any old, non-secure cookies would last. This can probably be safely removed
  // a month after that PR was deployed.
  addJwtCookie(req, res, user)

  res.locals.userAuthn = user
  next()
})
