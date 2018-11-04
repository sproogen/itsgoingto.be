const io = require('socket.io-client')

const identifier = process.argv[2]
const responses = process.argv[3]

const port = process.env.SOCKET_PORT || 8001

const socket = io(`http://socket-server:8001/responses?identifier=${identifier}`)

socket.emit('new-responses', responses, () => socket.close())
