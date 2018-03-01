/* eslint global-require: "off", no-console: "off" */
require('dotenv').config()

const app = require('./app')
const server = require('http').Server(app)
const io = require('socket.io')
const nextJs = require('next')
const co = require('co')

const routes = require('./routes')
const serverSocket = require('./socket/server')
const { baseUrl } = require('./util')

const DEV = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 3000

const nextApp = nextJs({ dev: DEV })
const handler = routes.getRequestHandler(nextApp)

/* eslint-disable func-names */
co(function*() {
  // Initialize the Next.js app
  yield nextApp.prepare()

  // Websocket stuff
  const socket = io(server, { path: `${baseUrl}/socket.io` })
  serverSocket(socket)

  app.use(handler)

  server.listen(PORT)
  console.log(`Listening on ${PORT}`)
}).catch(error => console.error(error.stack))
