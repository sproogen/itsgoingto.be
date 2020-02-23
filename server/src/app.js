import express from 'express'
import http from 'http'
import socketIO from 'socket.io'
import chalk from 'chalk'
import api from './api'

const port = process.env.PORT || 8001

const app = express()

const getActualRequestDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9; // constant to convert to nanoseconds
  const NS_TO_MS = 1e6; // constant to convert to milliseconds
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}

const logger = (req, res, next) => {
  const currentDatetime = new Date()
  const formattedDate = `${currentDatetime.getFullYear()}-${(currentDatetime.getMonth() + 1)}-${currentDatetime.getDate()} ${currentDatetime.getHours()}:${currentDatetime.getMinutes()}:${currentDatetime.getSeconds()}` // eslint-disable-line
  const { method } = req
  const { url } = req
  const status = res.statusCode

  const start = process.hrtime();
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);

  const log = `[${chalk.blue(
    formattedDate
  )}] ${method}:${url} ${status} ${chalk.red(
    durationInMilliseconds.toLocaleString() + 'ms' // eslint-disable-line
  )}`
  console.log(log)
  next()
};

app.use(logger)

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

app.listen(port, () => console.log(`Server listening on port ${port}!`))
