const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')

module.exports = withSass(
  withCSS({
    useFileSystemPublicRoutes: false,
    assetPrefix: process.env.BASE_URL || '',
  })
)
