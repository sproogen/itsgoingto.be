import express from 'express'
import { getPolls, getPoll, deletePoll } from './controllers'

const api = express()

// middleware

api.get('/', (req, res) => {
  res.send({
    message: 'Hello from the API',
  })
})

api.get('/polls', getPolls)
api.get('/polls/:identifier', getPoll)
api.delete('/polls/:identifier', deletePoll)

export default api
