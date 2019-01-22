/* eslint global-require: "off", no-console: "off" */
const app = require('express')()
const bodyParser = require('body-parser')
const session = require('express-session')
const rewrite = require('express-urlrewrite')

const { baseUrl } = require('./util')

const DEV = ['production', 'staging'].indexOf(process.env.NODE_ENV) === -1
const NOW = process.env.NODE_ENV === 'now'

// In production, all concepts of "sessions" will be handled by checking the
// eppn header from Shib. In dev, to support multiple users for testing, we
// use session middleware. For PR deploys to now, we won't have Shib in front
// of us, so we'll also use our own sessions there.
if (DEV || NOW) {
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

// Authentication
// All auth is handled by the /login route. In production, /login/shib is
// a special Shib-protected route. When a user is directed to that page,
// they'll need to sign in to Shib if they aren't already. Then, the request
// will hit that page with their user information present in headers. We can
// then establish our own session with them, which can persist beyond Shib's
// authentication restrictions.
if (DEV) {
  app.use(`${baseUrl}/login/dev`, require('./auth/dev'))
}
app.use(`${baseUrl}/login/shib`, require('./auth/shibboleth'))

// Shibboleth auth
// In dev, we need all requests to flow through the authn middleware so that
// we can properly handle a forceuser query param on a page load.
// In production, we only need this for the API routes; everything else is just statics.
if (DEV || NOW) {
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

// Error handling! This middleware should always be the last one in the chain.
app.use(require('./middleware/handleError'))

module.exports = app
