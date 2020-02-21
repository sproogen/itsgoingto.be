import express from 'express'
import api from './src/api'

const port = process.env.PORT || 8000

const app = express()

const server = http.createServer(app)
const io = socketIO(server)

app.use('/api', api(io))

io
  .of('/responses')
  .on('connection', (socket) => {
    console.log('User connected with id %s', socket.id)

    const identifier = socket.handshake.query.identifier
    const USERID = socket.handshake.query.USERID
    let fetchResponses

    if (identifier) {
      socket.join(identifier)
    }

    if (identifier && USERID) {
      socket.join(identifier + '/' + USERID)
    }

    socket.on('disconnect', () => {
      console.log('User with id %s disconnected', socket.id)

      clearInterval(fetchResponses)
    })
  })

app.listen(port, () => console.log(`Server listening on port ${port}!`))