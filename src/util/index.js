/* eslint-env browser */

module.exports.baseUrl =
  (typeof window !== 'undefined' && window.BASE_URL) ||
  (typeof process !== 'undefined' && process.env.BASE_URL) ||
  ''

module.exports.isDev =
  (typeof window !== 'undefined' && window.IS_DEV) ||
  (typeof process !== 'undefined' &&
    ['production', 'staging'].indexOf(process.env.NODE_ENV) === -1)

module.exports.withBaseUrl = url => `${module.exports.baseUrl}${url}`

module.exports.mapObjectToArray = o => {
  const keys = Object.keys(o).map(id => Number.parseInt(id, 10))
  const sortKeys = keys.sort((a, b) => (a < b ? -1 : 1))
  return sortKeys.map(id => o[id])
}
