import server from './server'

const port = process.env.PORT || 8001

server.listen(port, () => console.log(`Server listening on port ${port}!`))
