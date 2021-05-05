import express from 'express'
import { authRequired, authOptional } from './auth'
import {
  getPolls, createPoll, getPoll, deletePoll, getResponses, submitResponses, getStats, login
} from './controllers'

export default (io) => {
  const api = express()

  // middleware
  api.use(express.json())
  api.use(express.urlencoded({ extended: false }))

  api.get('/', (req, res) => {
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
