import express from 'express'
import {
  getPolls, createPoll, getPoll, deletePoll, submitResponses
} from './controllers'

const api = express()

// middleware
api.use(express.json())
api.use(express.urlencoded())

api.get('/', (req, res) => {
  res.send({
    message: 'Hello from the API',
  })
})

api.get('/polls', getPolls)
api.post('/polls', createPoll)
api.get('/polls/:identifier', getPoll)
api.delete('/polls/:identifier', deletePoll)
api.post('/polls/:identifier/responses', submitResponses)

export default api
