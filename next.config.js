const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withTypescript = require('@zeit/next-typescript')
// Run `ANALYZE=true npm run build` to generate and view bundle stats
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(
  withTypescript(
    withSass(
      withCSS({
        useFileSystemPublicRoutes: false,
        assetPrefix: process.env.BASE_URL || '',
      })
    )
  )
)
