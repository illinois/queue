import safeAsync from './safeAsync'

const { withBaseUrl } = require('../util')
const { getUserFromJwt } = require('../auth/util')

// We'll assume that if a route is not Next.js statics, general statics, or
// an API, then it will require auth
// Note that this middleware is mounted at `/BASE_URL`, so these paths are
// relative to that
const authnWhitelist = [
  '/_next',
  '/static',
  '/api',
  '/login',
  '/logout',
  '/auth',
]

const checkPathAgainstWhitelist = (path, whitelist) => {
  return whitelist.some(base => path.indexOf(base) === 0)
}

module.exports = safeAsync(async (req, res, next) => {
  const { path } = req
  if (checkPathAgainstWhitelist(path, authnWhitelist)) {
    // This path hit the whitelist; we're good
    next()
    return
  }

  // We need to ensure that the user is authed
  // JWT time!
  const jwtCookie = req.cookies.jwt
  const user = await getUserFromJwt(jwtCookie)
  if (user === null) {
    let url = withBaseUrl('/login')
    // `path` isn't prefixed by BASE_URL
    if (path !== '' && path !== '/') {
      const fullPath = withBaseUrl(path)
      url += `?redirect=${fullPath}`
    }
    res.redirect(url)
  } else {
    next()
  }
})
