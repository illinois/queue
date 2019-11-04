const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withTypescript = require('@zeit/next-typescript')
// const withBundleAnalyzer = require('@next/bundle-analyzer')
const withBundleAnalyzer = args => args

// Run `ANALYZE=true npm run build` to generate and view these stats
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
