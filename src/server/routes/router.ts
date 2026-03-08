import http from 'http'
import { characterController } from '../controllers/character-controller.js'
import { OK, NOT_FOUND } from '../../utils/status-codes.js'

export class Router {
  private routes: Map<string, Map<string, (req: http.IncomingMessage, res: http.ServerResponse, ...args: any[]) => Promise<void>>> = new Map()

  constructor() {
    this.setupRoutes()
  }

  private setupRoutes(): void {
    this.addRoute('GET', '/characters', async (req, res) => characterController.getCharacters(req, res))
    this.addRoute('POST', '/characters', async (req, res) => characterController.createCharacter(req, res))
    this.addRoute('GET', '/characters/:id', async (req, res, id) => characterController.getCharacterById(req, res, id))
    this.addRoute('GET', '/', async (_, res) => this.sendJsonResponse(res, OK, { message: 'Hello from Node.js! server' }))
    this.addRoute('GET', '/test', async (_, res) => this.sendJsonResponse(res, OK, { message: 'Hello from test endpoint!' }))
    this.addRoute('GET', '/about', async (_, res) => this.sendJsonResponse(res, OK, { message: 'Hello from about endpoint!' }))
    this.addRoute('GET', '/user', async (_, res) => this.sendJsonResponse(res, OK, { message: 'Hello from user endpoint!' }))
    this.addRoute('GET', '/messages', async (_, res) => this.sendHtmlResponse(res, '<html><body><h1>Hello from messages endpoint!</h1></body></html>'))
  }

  private addRoute(method: string, path: string, handler: (req: http.IncomingMessage, res: http.ServerResponse, ...args: any[]) => Promise<void>): void {
    if (!this.routes.has(method)) {
      this.routes.set(method, new Map())
    }
    this.routes.get(method)!.set(path, handler)
  }

  async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const method = req.method?.toUpperCase() || 'GET'
    const url = req.url || '/'

    const handler = this.findHandler(method, url)
    if (handler) {
      const params = this.extractParams(url)
      await handler(req, res, ...params)
    } else {
      this.sendJsonResponse(res, NOT_FOUND, { error: 'Not Found', message: `The route ${url} does not exist on the server` })
    }
  }

  private findHandler(method: string, url: string): ((req: http.IncomingMessage, res: http.ServerResponse, ...args: any[]) => Promise<void>) | null {
    const methodRoutes = this.routes.get(method)
    if (!methodRoutes) return null

    for (const [path, handler] of methodRoutes) {
      if (this.matchPath(path, url)) {
        return handler
      }
    }
    return null
  }

  private matchPath(routePath: string, url: string): boolean {
    if (routePath === url) return true

    const routeParts = routePath.split('/')
    const urlParts = url.split('/')

    if (routeParts.length !== urlParts.length) return false

    return routeParts.every((part, index) => {
      return part.startsWith(':') || part === urlParts[index]
    })
  }

  private extractParams(url: string): string[] {
    const parts = url.split('/')
    return parts.length > 2 ? [parts[2]] : []
  }

  private sendJsonResponse(res: http.ServerResponse, statusCode: number, data: any): void {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
  }

  private sendHtmlResponse(res: http.ServerResponse, html: string): void {
    res.writeHead(OK, { 'Content-Type': 'text/html' })
    res.end(html)
  }
}

export const router = new Router()
