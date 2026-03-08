import http from 'http'
import { router } from './routes/router.js'

const server = http.createServer((req, res) => {
  router.handleRequest(req, res).catch((error) => {
    console.error('Request handling error:', error)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Internal server error' }))
  })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default server
