const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withTypescript = require('@zeit/next-typescript')

const ENV = process.env.NODE_ENV || 'development'

require('dotenv').config({ path: `.env.${ENV}` })

module.exports = withTypescript(
  withSass(
    withCSS({
      useFileSystemPublicRoutes: false,
      assetPrefix: process.env.BASE_URL || '',
      publicRuntimeConfig: {
        uidName: process.env.UID_NAME || 'email',
        uidArticle: process.env.UID_ARTICLE || 'an',
        institutionName: process.env.INSTITUTION_NAME || 'Illinois',
      },
    })
  )
)
