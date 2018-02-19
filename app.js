/* eslint global-require: "off", no-console: "off" */
const app = require('express')()
const bodyParser = require('body-parser')
const session = require('express-session')
const rewrite = require('express-urlrewrite')

const { baseUrl } = require('./util')

const DEV = process.env.NODE_ENV !== 'production'

// In production, all concepts of "sessions" will be handled by checking the
// eppn header from Shib. In dev, to support multiple users for testing, we
// use session middleware.
if (DEV) {
  app.use(session({
    secret: 'this is not a secret',
    resave: false,
    saveUninitialized: true,
  }))
}

// Configure express to expose a REST API
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Forward next + statics requests to the right route handlers
app.use(rewrite(`${baseUrl}/_next/*`, '/_next/$1'))
app.use(rewrite(`${baseUrl}/static/*`, '/static/$1'))

// Prettify all json by default
app.use(require('./middleware/prettyPrintJson'))

// Shibboleth auth
// We only need this for the API routes; everything else is just statics.
app.use(`${baseUrl}/api`, DEV ? require('./middleware/authnDev') : require('./middleware/authn'))
app.use(`${baseUrl}/api`, require('./middleware/authz'))

// API routes
app.use(`${baseUrl}/api/users`, require('./api/users'))
app.use(`${baseUrl}/api/courses`, require('./api/courses'))
app.use(`${baseUrl}/api/queues`, require('./api/queues'))
app.use(`${baseUrl}/api/questions`, require('./api/questions'))
app.use(`${baseUrl}/api/courses/:courseId/queues`, require('./api/queues'))
app.use(`${baseUrl}/api/courses/:courseId/queues/:queueId/questions`, require('./api/questions'))
app.use(`${baseUrl}/api/queues/:queueId/questions`, require('./api/questions'))

module.exports = app
