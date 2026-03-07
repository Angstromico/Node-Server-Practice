# 🌐 HTTP Request Practice - Node.js

A **practice repository** for learning and experimenting with HTTP requests using Node.js and TypeScript. This space is dedicated to understanding various HTTP methods, APIs, and networking concepts through hands-on coding exercises.

## ✨ What's Included

- **🔷 TypeScript** - Strict type checking configured
- **⚡ tsx** - Instant run without compilation (`npm run dev`)
- **🧪 Vitest** - Fast testing framework
- **📏 ESLint + Prettier** - Code quality and formatting
- **🪝 Husky** - Pre-commit hooks (optional)
- **🎯 Path Aliases** - Use `@/` instead of `../../`

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

## 🛠️ Quick Start

```bash
# Install dependencies
npm install

# Start development (hot-reload)
npm run dev

# Build for production
npm run build

# Run compiled code
npm start
```

## 📜 Available Scripts

| Script             | Description                           |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Run with hot-reload (no build needed) |
| `npm run build`    | Compile TypeScript to JavaScript      |
| `npm start`        | Run compiled code                     |
| `npm test`         | Run tests in watch mode               |
| `npm run lint`     | Check code quality                    |
| `npm run format`   | Format code with Prettier             |
| `npm run validate` | Run all checks                        |

## 📁 Project Structure

```text
src/
└── index.ts    # HTTP request practice exercises
```

This repository contains various exercises and examples for practicing HTTP requests, including:
- GET, POST, PUT, DELETE requests
- Working with different APIs
- Handling responses and errors
- Request/response interceptors
- Authentication and headers

## 🎯 Path Aliases

Instead of messy relative imports:

```typescript
// ❌ Avoid
import { something } from '../../../utils/something'

// ✅ Use
import { something } from '@/utils/something.js'
```

## 💡 HTTP Request Practice Examples

### Basic GET Request

```typescript
import { https } from 'node:https'

// Simple GET request example
const fetchData = async (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => resolve(JSON.parse(data)))
    }).on('error', reject)
  })
}
```

### POST Request with Data

```typescript
// POST request with JSON data
const postData = async (url: string, data: object): Promise<any> => {
  const postData = JSON.stringify(data)
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }
  
  // Implementation details...
}
```

### Testing with Vitest

Create a file like `src/example.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'

describe('example', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2)
  })
})
```

Run tests:

```bash
npm test
```

## 🔧 Configuration Files

- `tsconfig.json` - TypeScript configuration (strict mode enabled)
- `eslint.config.mjs` - ESLint rules
- `.prettierrc.json` - Code formatting rules
- `vitest.config.ts` - Test configuration

Feel free to modify these as you learn!

## 🚀 Building for Production

```bash
npm run build   # Creates dist/ folder
npm start       # Runs the compiled code
```

## 📚 Learning Path

1. **Basic HTTP Methods** - Practice GET, POST, PUT, DELETE requests
2. **Response Handling** - Learn to parse different response formats (JSON, XML, text)
3. **Error Management** - Handle network errors, timeouts, and HTTP status codes
4. **Authentication** - Work with API keys, OAuth, and other auth methods
5. **Advanced Topics** - Request interceptors, caching, rate limiting
6. **Testing HTTP Code** - Mock HTTP responses and test request handling

## 📖 Resources

- [Node.js HTTP/HTTPS Documentation](https://nodejs.org/docs/latest/api/http.html)
- [MDN HTTP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vitest Documentation](https://vitest.dev/)

## 📄 License

MIT

---

**Happy HTTP Practicing! �**
