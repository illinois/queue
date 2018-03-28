const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  useFileSystemPublicRoutes: false,
  assetPrefix: process.env.BASE_URL || '',
})
