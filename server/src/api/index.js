import express from 'express'
import sequelize from '../db'
import { getPoll } from './controllers'

const api = express()

// middleware

api.get('/', (req, res) => {
  res.send({
    message: 'Hello from the API',
  })
})

api.get('/polls/:identifier', getPoll)

export default api
