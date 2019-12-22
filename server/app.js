import express from 'express'
import api from './src/api'

const port = process.env.PORT || 8000

const app = express()

app.use('/api', api)

app.listen(port, () => console.log(`Server listening on port ${port}!`))