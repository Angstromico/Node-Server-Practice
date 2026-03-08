import http from 'http'
import fs from 'fs/promises'
import path from 'path'
import { OK, NOT_FOUND } from '@/utils/status-codes.js'
import characters from './characters.js'
import type { ICharacter } from './characters.js'

const server = http.createServer((req, res) => {
  const parts = req.url?.split('/') || []
  const resource = parts[1]
  const id = parts[2]

  if (req.method === 'POST' && req.url === '/characters') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      void handleCharacterPost(body, res)
    })

    async function handleCharacterPost(body: string, res: http.ServerResponse) {
      try {
        const newCharacter = JSON.parse(body) as ICharacter

        if (
          newCharacter.name &&
          newCharacter.height &&
          newCharacter.mass &&
          newCharacter.hair_color &&
          newCharacter.skin_color &&
          newCharacter.eye_color &&
          newCharacter.birth_year &&
          newCharacter.gender
        ) {
          characters.push(newCharacter)

          const charactersFilePath = path.join(process.cwd(), 'src', 'server', 'characters.ts')

          const currentContent = await fs.readFile(charactersFilePath, 'utf-8')

          const interfaceMatch = currentContent.match(/export interface ICharacter \{[\s\S]*?\}/)
          const interfacePart = interfaceMatch ? interfaceMatch[0] : ''

          const newCharactersArray = `const characters = [
  ${characters
    .map(
      (char) => `  {
    name: '${char.name}',
    height: '${char.height}',
    mass: '${char.mass}',
    hair_color: '${char.hair_color}',
    skin_color: '${char.skin_color}',
    eye_color: '${char.eye_color}',
    birth_year: '${char.birth_year}',
    gender: '${char.gender}',
  }`
    )
    .join(',\n')},
]`

          const newContent = `${interfacePart}

${newCharactersArray}

export default characters
`

          await fs.writeFile(charactersFilePath, newContent, 'utf-8')

          res.writeHead(201, { 'Content-Type': 'application/json' })
          res.end(
            JSON.stringify({
              message: 'Character added and saved permanently!',
              data: newCharacter,
            })
          )
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            error: 'Invalid JSON or file write error',
            details:
              typeof error === 'string'
                ? error
                : error instanceof Error
                  ? error.message
                  : String(error),
          })
        )
      }
    }
    return
  }

  if (req.url === '/characters') {
    res.writeHead(OK, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(characters))
    return
  }

  if (resource === 'characters' && id) {
    const index = parseInt(id) - 1
    const character = characters[index]

    if (character) {
      res.writeHead(OK, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(character))
      return
    } else {
      res.writeHead(NOT_FOUND, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Character not found' }))
      return
    }
  }

  if (req.url === '/') {
    res.writeHead(OK, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Hello from Node.js! server' }))
    return
  } else if (req.url === '/test') {
    res.writeHead(OK, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Hello from test endpoint!' }))
    return
  } else if (req.url === '/about') {
    res.writeHead(OK, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Hello from about endpoint!' }))
    return
  } else if (req.url?.includes('user')) {
    res.writeHead(OK, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Hello from user endpoint!' }))
    return
  } else if (req.url?.includes('messages')) {
    res.write('<html>')
    res.write('<body><h1>Hello from messages endpoint!</h1></body>')
    res.write('</html>')
    res.end()
    return
  } else {
    res.writeHead(NOT_FOUND, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        error: 'Not Found',
        message: `The route ${req.url} does not exists on the server`,
      })
    )
    return
  }
})

export default server
