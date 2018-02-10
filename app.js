/* eslint global-require: "off", no-console: "off" */
const app = require('express')()
const bodyParser = require('body-parser')
const session = require('express-session')
const rewrite = require('express-urlrewrite')

const { User } = require('./models')
const { baseUrl } = require('./util')

const DEV = process.env.NODE_ENV !== 'production'

// In production, all concepts of "sessions" will be handled by checking the
// eppn header from Shib. In dev, to support multiple users for testing, we
// use session middleware.
if (DEV) {
  app.use(session({
    secret: 'this is not a secret',
  }))
  app.use(async (req, res, next) => {
    if (req.query.forceuser) {
      const netid = req.query.forceuser
      const [user] = await User.findOrCreate({ where: { netid } })
      req.session.user = user
      res.locals.user = user
    }
    next()
  })
}

// Configure express to expose a REST API
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Forward next requests to the right URL
app.use(rewrite(`${baseUrl}/_next/*`, '/_next/$1'))

// Prettify all json by default
app.use((req, res, next) => {
  res.json = (body) => {
    if (!res.get('Content-Type')) {
      res.set('Content-Type', 'application/json')
    }
    res.send(JSON.stringify(body, null, 2))
  }
  next()
})

// Shibboleth auth
app.use(require('./middleware/authn'))
app.use(require('./middleware/authz'))

// API routes
app.use(`${baseUrl}/api/users`, require('./api/users'))
app.use(`${baseUrl}/api/courses`, require('./api/courses'))
app.use(`${baseUrl}/api/queues`, require('./api/queues'))
app.use(`${baseUrl}/api/questions`, require('./api/questions'))
app.use(`${baseUrl}/api/courses/:courseId/queues`, require('./api/queues'))
app.use(`${baseUrl}/api/courses/:courseId/queues/:queueId/questions`, require('./api/questions'))
app.use(`${baseUrl}/api/queues/:queueId/questions`, require('./api/questions'))

module.exports = app
