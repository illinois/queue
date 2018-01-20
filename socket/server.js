let socket = null

export function questionsUpdated() {
  if (socket) {
    socket.emit('questions.update')
  }
}

export default (io) => io.on('connection', newSocket => socket = newSocket)
