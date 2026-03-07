import http from 'http'
import { OK, NOT_FOUND } from '@/utils/status-codes.js'

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(OK, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Hello from Node.js! server' }))
  } else if (req.url === '/test') {
    res.writeHead(OK, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Hello from test endpoint!' }))
  } else if (req.url === '/about') {
    res.writeHead(OK, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Hello from about endpoint!' }))
  } else if (req.url?.includes('user')) {
    res.writeHead(OK, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Hello from user endpoint!' }))
  } else if (req.url?.includes('messages')) {
    res.write('<html>')
    res.write('<body><h1>Hello from messages endpoint!</h1></body>')
    res.write('</html>')
  } else {
    res.writeHead(NOT_FOUND, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        error: 'Not Found',
        message: `The route ${req.url} does not exists on the server`,
      })
    )
  }
})

export default server
