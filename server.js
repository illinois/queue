/* eslint global-require: "off", no-console: "off" */
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const nextJs = require('next')
const co = require('co')
const bodyParser = require('body-parser')
const session = require('express-session')
const rewrite = require('express-urlrewrite')

const routes = require('./routes')
const { User } = require('./models')
const serverSocket = require('./socket/server')
const { baseUrl } = require('./util')

const DEV = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 3000

const nextApp = nextJs({ dev: DEV })
const handler = routes.getRequestHandler(nextApp)

/* eslint-disable func-names */
co(function* () {
  // Initialize the Next.js app
  yield nextApp.prepare()

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
    res.json = function (body) {
      if (!res.get('Content-Type')) {
        res.set('Content-Type', 'application/json')
      }
      res.send(JSON.stringify(body, null, 2))
    }
    next()
  })

  // Websocket stuff
  serverSocket(io)

  // Shibboleth auth
  app.use(async (req, res, next) => {
    // Get the user's NetID based on the "eppn" field
    // Temporarily disable this in dev
    if (DEV && req.session.user) {
      res.locals.user = req.session.user
      next()
    } else if (DEV) {
      // By default, create or find admin user "dev"
      const [user] = await User.findOrCreate({
        where: {
          netid: 'dev',
        },
        defaults: {
          isAdmin: true,
        },
      })
      req.session.user = user
      res.locals.user = user
      next()
    } else {
      const email = req.get('eppn') || ''
      if (email.indexOf('@') === -1) {
        throw new Error('No login found.')
      }
      const [netid] = email.split('@')

      const [user] = await User.findOrCreate({ where: { netid } })
      res.locals.user = user
      next()
    }
  })

  // API routes
  app.use('/api/users', require('./routes/users'))
  app.use('/api/courses', require('./routes/courses'))
  app.use('/api/queues', require('./routes/queues'))
  app.use('/api/questions', require('./routes/questions'))
  app.use('/api/courses/:courseId/queues', require('./routes/queues'))
  app.use('/api/courses/:courseId/queues/:queueId/questions', require('./routes/questions'))
  app.use('/api/queues/:queueId/questions', require('./routes/questions'))

  app.use(handler)

  server.listen(PORT)
  console.log(`Listening on ${PORT}`)
}).catch(error => console.error(error.stack))
