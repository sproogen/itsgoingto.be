import path from 'path'
import express from 'express'
import http from 'http'
import socketIO from 'socket.io'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import api from './api'

const app = express()

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'))
}
app.use(cookieParser())

const server = http.createServer(app)
const io = socketIO(server)

app.use('/api', api(io))

io
  .of('/responses')
  .on('connection', (socket) => {
    console.log('User connected with id %s', socket.id)

    const { identifier, USERID } = socket.handshake.query
    let fetchResponses

    if (identifier) {
      socket.join(identifier)
    }

    if (identifier && USERID) {
      socket.join(`${identifier}/${USERID}`)
    }

    socket.on('disconnect', () => {
      console.log('User with id %s disconnected', socket.id)

      clearInterval(fetchResponses)
    })
  })

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
  })
}

export default server
