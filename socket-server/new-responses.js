const io = require('socket.io-client')

const env = process.env.APP_ENV
const identifier = process.argv[2]
const responses = process.argv[3]
const USERID = process.argv[4]

let socketDomain

if (env === 'prod') {
  socketDomain = 'localhost'
} else if (env === 'dev') {
  socketDomain = 'socket-server'
}

if (socketDomain) {
  const socket = io(`http://${socketDomain}:8001/responses?identifier=${identifier}&USERID=${USERID}`)

  socket.emit('new-responses', responses, () => socket.close())
}
