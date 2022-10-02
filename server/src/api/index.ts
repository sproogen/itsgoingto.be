import express, { Express } from 'express'
import { Server } from 'socket.io'
import { authRequired, authOptional } from './auth'
import {
  getPolls, createPoll, getPoll, deletePoll, getResponses, submitResponses, getStats, login,
} from './controllers'

export default (io: Server): Express => {
  const api = express()

  // middleware
  api.use(express.json())
  api.use(express.urlencoded({ extended: false }))

  api.get('/', (_req, res) => {
    res.send({
      message: 'Hello from the API',
    })
  })

  api.get('/polls', authRequired, getPolls)
  api.post('/polls', createPoll)
  api.get('/polls/:identifier', authOptional, getPoll)
  api.delete('/polls/:identifier', authRequired, deletePoll)
  api.get('/polls/:identifier/responses', authOptional, getResponses)
  api.post('/polls/:identifier/responses', submitResponses(io))
  api.get('/stats', authRequired, getStats)
  api.post('/login', login)

  return api
}
