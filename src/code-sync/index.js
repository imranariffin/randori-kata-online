import socketio from 'socket.io-client'

let socket

const codeSyncInit = () => {
  if (socket) {
    return socket
  }
  socket = socketio('http://localhost:3000')
  return socket
}

export default {
  codeSyncInit
}
