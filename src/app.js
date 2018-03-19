/* eslint global-require: "off", no-console: "off" */
const app = require('express')()
const bodyParser = require('body-parser')
const session = require('express-session')
const rewrite = require('express-urlrewrite')

const { baseUrl } = require('./util')

const DEV = ['production', 'staging'].indexOf(process.env.NODE_ENV) === -1

// In production, all concepts of "sessions" will be handled by checking the
// eppn header from Shib. In dev, to support multiple users for testing, we
// use session middleware.
if (DEV) {
  app.use(
    session({
      secret: 'this is not a secret',
      resave: false,
      saveUninitialized: true,
    })
  )
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Forward next + statics requests to the right route handlers
app.use(rewrite(`${baseUrl}/_next/*`, '/_next/$1'))
app.use(rewrite(`${baseUrl}/static/*`, '/static/$1'))

// Prettify all json by default
app.use(require('./middleware/prettyPrintJson'))

// Shibboleth auth
// In dev, we need all requests to flow through the authn middleware so that
// we can properly handle a forceuser query param on a page load.
// In production, we only need this for the API routes; everything else is just statics.
if (DEV) {
  app.use(baseUrl, require('./middleware/authnDev'))
} else {
  app.use(`${baseUrl}/api`, require('./middleware/authn'))
}
app.use(`${baseUrl}/api`, require('./middleware/authz'))

// API routes
app.use(`${baseUrl}/api/users`, require('./api/users'))
app.use(`${baseUrl}/api/courses`, require('./api/courses'))
app.use(`${baseUrl}/api/queues`, require('./api/queues'))
app.use(`${baseUrl}/api/questions`, require('./api/questions'))
app.use(`${baseUrl}/api/courses/:courseId/queues`, require('./api/queues'))
app.use(
  `${baseUrl}/api/courses/:courseId/queues/:queueId/questions`,
  require('./api/questions')
)
app.use(`${baseUrl}/api/queues/:queueId/questions`, require('./api/questions'))

// Support for course shortcodes
app.use(`${baseUrl}/:courseCode`, require('./middleware/courseShortcodes'))

// Support for redirects of nonexistent queues
app.use(`${baseUrl}/queue/:queueId`, require('./middleware/redirectNoQueue'))

module.exports = app
