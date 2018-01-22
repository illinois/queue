/* eslint global-require: "off", no-console: "off" */
const express = require('express')
const nextJs = require('next')
const co = require('co')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const routes = require('./routes')
const { User } = require('./models')

const DEV = process.env.NODE_ENV !== 'production'
const PORT = 3000

const app = nextJs({ dev: DEV })
const handler = routes.getRequestHandler(app)

/* eslint-disable func-names */
co(function* () {
  // Initialize the Next.js app
  yield app.prepare()

  // Configure express to expose a REST API
  const server = express()
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(cookieParser())
  server.use(session({
    secret: 'jkf94u8ui35gknchFJKHEJOHEF)*3f',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  }))

  // Shibboleth auth
  server.use((req, res, next) => {
    // Get the user's NetID based on the "eppn" field
    // Temporarily disable this in dev
    let netid
    if (DEV) {
      netid = 'dev'
    } else {
      const email = req.get('eppn')
      if (email.indexOf('@') === -1) { throw new Error('No login found.') }
      [netid] = email.split('@')
    }

    // Check if the user has a session, and verify the netid in the session;
    // otherwise, create the session
    if (req.session.user && req.session.user.netid === netid) {
      next()
    } else {
      User.findOrCreate({ where: { netid } }).spread((user) => {
        req.session.user = user
        next()
      })
    }
  })

  // API routes
  server.use('/api/users', require('./routes/users'))
  server.use('/api/courses', require('./routes/courses'))
  server.use('/api/queues', require('./routes/queues'))
  server.use('/api/questions', require('./routes/questions'))
  server.use('/api/courses/:courseId/queues', require('./routes/queues'))
  server.use('/api/courses/:courseId/queues/:queueId/questions', require('./routes/questions'))
  server.use('/api/queues/:queueId/questions', require('./routes/questions'))

  server.use(handler)

  server.listen(PORT)
  console.log(`Listening on ${PORT}`)
}).catch(error => console.error(error.stack))
