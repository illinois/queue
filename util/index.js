/* eslint-env browser */

module.exports.baseUrl = (typeof window !== 'undefined' && window.API_BASE)
                      || (typeof process !== 'undefined' && process.env.ASSET_PREFIX)
                      || ''
