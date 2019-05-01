const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withTypescript = require('@zeit/next-typescript')

module.exports = withTypescript(
  withSass(
    withCSS({
      useFileSystemPublicRoutes: false,
      assetPrefix: process.env.BASE_URL || '',
      publicRuntimeConfig: {
        uidName: 'email',
        uidArticle: 'an',
      },
    })
  )
)
