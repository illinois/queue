/* eslint global-require: "off", no-console: "off" */
require('dotenv').config()

const { Server } = require('http')
const io = require('socket.io')
const nextJs = require('next')
const co = require('co')

const app = require('./app')
const logger = require('./util/logger')
const models = require('./models')
const migrations = require('./migrations/util')
const routes = require('./routes')
const serverSocket = require('./socket/server')
const { baseUrl } = require('./util')

const DEV =
  ['now', 'staging', 'production'].indexOf(process.env.NODE_ENV) === -1
const PORT = process.env.PORT || 3000

const nextApp = nextJs({ dev: DEV, dir: DEV ? 'src' : 'build' })
const handler = routes.getRequestHandler(nextApp)

/* eslint-disable func-names */
co(function*() {
  // Do this first to catch any problems during startup
  process.on('unhandledRejection', (err, promise) => {
    console.error(
      'Unhandled rejection (promise: ',
      promise,
      ', reason: ',
      err,
      ').'
    )
  })

  // Initialize the Next.js app
  yield nextApp.prepare()

  // Initialize the database
  yield migrations.performMigrations(models.sequelize)

  // Initialize the server
  const server = Server(app)

  // Websocket stuff
  const socket = io(server, { path: `${baseUrl}/socket.io` })
  serverSocket(socket)

  app.use(handler)

  server.listen(PORT)
  logger.info(`Listening on ${PORT}`)
}).catch(error => console.error(error.stack))
