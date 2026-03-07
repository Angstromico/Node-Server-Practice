import http from 'http'
import { OK, NOT_FOUND } from '@/utils/status-codes.js'
import characters from './characters.js'


const server = http.createServer((req, res) => {
  const parts = req.url?.split('/') || [];
  const resource = parts[1];
  const id = parts[2];

  if (req.url === '/characters') {
    res.writeHead(OK, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(characters));
    return;
  }

  if (resource === 'characters' && id) {
    const index = parseInt(id) - 1;
    const character = characters[index];

    if (character) {
      res.writeHead(OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(character));
      return;
    } else {
      res.writeHead(NOT_FOUND, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Character not found' }));
      return;
    }
  }

  if (req.url === '/') {
    res.writeHead(OK, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from Node.js! server' }));
    return;
  } else if (req.url === '/test') {
    res.writeHead(OK, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from test endpoint!' }));
    return;
  } else if (req.url === '/about') {
    res.writeHead(OK, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from about endpoint!' }));
    return;
  } else if (req.url?.includes('user')) {
    res.writeHead(OK, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from user endpoint!' }));
    return;
  } else if (req.url?.includes('messages')) {
    res.write('<html>');
    res.write('<body><h1>Hello from messages endpoint!</h1></body>');
    res.write('</html>');
    res.end();
    return;
  } else {
    res.writeHead(NOT_FOUND, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: 'Not Found',
        message: `The route ${req.url} does not exists on the server`,
      })
    );
    return;
  }
})

export default server
