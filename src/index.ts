import http from 'http'
import { OK } from './utils/status-codes.js'

const PORT = process.env.PORT || 3000

const server = http.createServer((_, res) => {
  res.writeHead(OK, { 'Content-Type': 'application/json' })
  const responseData = JSON.stringify({ message: 'Hello from Node.js! server' })

  res.end(responseData)
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
