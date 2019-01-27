const safeAsync = require('../middleware/safeAsync')
const { getUserFromJwt } = require('../auth/util')

module.exports = safeAsync(async (req, res, next) => {
  const jwtCookie = req.cookies.jwt
  if (!jwtCookie) {
    res.status(401).send()
    return
  }

  const user = await getUserFromJwt(jwtCookie)
  if (user === null) {
    // This shouldn't ever happen, but if it does...
    res.status(401).send()
    return
  }

  res.locals.userAuthn = user
  next()
})
