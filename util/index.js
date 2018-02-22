/* eslint-env browser */

module.exports.baseUrl = (typeof window !== 'undefined' && window.BASE_URL)
                      || (typeof process !== 'undefined' && process.env.BASE_URL)
                      || ''

module.exports.withBaseUrl = url => `${module.exports.baseUrl}${url}`
