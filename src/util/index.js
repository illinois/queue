/* eslint-env browser */

module.exports.baseUrl =
  (typeof window !== 'undefined' && window.BASE_URL) ||
  (typeof process !== 'undefined' && process.env.BASE_URL) ||
  ''

module.exports.isDev =
  (typeof window !== 'undefined' && window.IS_DEV) ||
  (typeof process !== 'undefined' &&
    ['production', 'staging'].indexOf(process.env.NODE_ENV) === -1)

// Lets us identify if we're running under Zeit's Now
// This is mostly useful for our GitHub PR deployments - we special-case some
// behavior there to work around things like the lack of Shib auth
module.exports.isNow =
  (typeof window !== 'undefined' && window.IS_NOW) ||
  (typeof process !== 'undefined' && process.env.NOW === '1')

module.exports.withBaseUrl = url => `${module.exports.baseUrl}${url}`

module.exports.mapObjectToArray = o => {
  const keys = Object.keys(o).map(id => Number.parseInt(id, 10))
  const sortKeys = keys.sort((a, b) => (a < b ? -1 : 1))
  return sortKeys.map(id => o[id])
}

// Make a raw url SSR friendly
module.exports.getApiUrl = (route, req) => {
  const protocol = module.exports.isDev ? 'http' : 'https'
  return process.browser
    ? `${protocol}://${window.location.host}${route}`
    : `${protocol}://${req.headers.host}${route}`
}
