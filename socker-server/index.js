import express from 'express'
import http from 'http'
import socketIO from 'socket.io'
import fetch from 'node-fetch'

const port = process.env.PORT || 8001

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

io
  .of('/responses')
  .on('connection', socket => {
    console.log('User connected with id %s', socket.id)

    const identifier = socket.handshake.query.identifier
    let fetchResponses

    if (identifier) {
      socket.join(identifier)
    }

    socket.on('new-response', () => {
      console.log('User with id %s submitted new response', socket.id)

      fetch(`http://localhost:8000/api/polls/${identifier}/responses`)
        .then(response => response.json())
        .then((response) => {
          io.of('/responses').to(identifier).emit('responses-updated', response)
        })
    })

    socket.on('disconnect', () => {
      console.log('User with id %s disconnected', socket.id)

      clearInterval(fetchResponses)
    })
  })

server.listen(port, () => console.log(`Websocket listening on port ${port}`))
