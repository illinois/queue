/* eslint global-require: "off", no-console: "off" */
require('dotenv').config()

const { app, session } = require('./app')
const server = require('http').Server(app)
const io = require('socket.io')
const nextJs = require('next')
const co = require('co')

const logger = require('./util/logger')
const models = require('./models')
const migrations = require('./migrations/util')
const routes = require('./routes')
const serverSocket = require('./socket/server')
const { baseUrl } = require('./util')

const DEV = ['production', 'staging'].indexOf(process.env.NODE_ENV) === -1
const PORT = process.env.PORT || 3000

const nextApp = nextJs({ dev: DEV })
const handler = routes.getRequestHandler(nextApp)

/* eslint-disable func-names */
co(function*() {
  // Initialize the Next.js app
  yield nextApp.prepare()

  // Initialize the database
  yield migrations.performMigrations(models.sequelize)

  // Websocket stuff
  const socket = io(server, { path: `${baseUrl}/socket.io` })
  serverSocket(socket, session)

  app.use(handler)

  server.listen(PORT)
  logger.info(`Listening on ${PORT}`)
}).catch(error => console.error(error.stack))
