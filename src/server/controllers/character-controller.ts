import http from 'http'
import { characterService } from '../services/character-service.js'
import type { ICharacter } from '../types/character.js'

export class CharacterController {
  async getCharacters(_req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      const characters = await characterService.getAllCharacters()
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(characters))
    } catch (error) {
      this.sendError(res, 500, 'Internal server error')
    }
  }

  async getCharacterById(_req: http.IncomingMessage, res: http.ServerResponse, id: string): Promise<void> {
    try {
      const characterId = parseInt(id, 10)
      if (isNaN(characterId) || characterId < 1) {
        this.sendError(res, 400, 'Invalid character ID')
        return
      }

      const character = await characterService.getCharacterById(characterId)
      if (!character) {
        this.sendError(res, 404, 'Character not found')
        return
      }

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(character))
    } catch (error) {
      this.sendError(res, 500, 'Internal server error')
    }
  }

  async createCharacter(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      const body = await this.getRequestBody(req)
      const characterData = JSON.parse(body)

      if (!characterService.validateCharacter(characterData)) {
        this.sendError(res, 400, 'Invalid character data. All fields are required.')
        return
      }

      const newCharacter = await characterService.createCharacter(characterData as ICharacter)
      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Character added and saved permanently!', data: newCharacter }))
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.sendError(res, 400, 'Invalid JSON')
      } else {
        this.sendError(res, 500, 'Internal server error')
      }
    }
  }

  private getRequestBody(req: http.IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        resolve(body)
      })
      req.on('error', reject)
    })
  }

  private sendError(res: http.ServerResponse, statusCode: number, message: string): void {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: message }))
  }
}

export const characterController = new CharacterController()
