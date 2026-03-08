import fs from 'fs/promises'
import path from 'path'
import type { ICharacter } from '../types/character.js'

class CharacterService {
  private characters: ICharacter[] = []
  private readonly filePath: string

  constructor() {
    this.filePath = path.join(process.cwd(), 'src', 'server', 'characters.ts')
    this.loadCharacters()
  }

  private async loadCharacters(): Promise<void> {
    try {
      const { default: characters } = await import('../characters.js')
      this.characters = [...characters]
    } catch (error) {
      this.characters = []
    }
  }

  private async saveToFile(): Promise<void> {
    const currentContent = await fs.readFile(this.filePath, 'utf-8')
    const interfaceMatch = currentContent.match(/export interface ICharacter \{[\s\S]*?\}/)
    const interfacePart = interfaceMatch ? interfaceMatch[0] : ''

    const newCharactersArray = `const characters = [
  ${this.characters
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

    await fs.writeFile(this.filePath, newContent, 'utf-8')
  }

  async getAllCharacters(): Promise<ICharacter[]> {
    return [...this.characters]
  }

  async getCharacterById(id: number): Promise<ICharacter | null> {
    const index = id - 1
    return this.characters[index] || null
  }

  async createCharacter(character: ICharacter): Promise<ICharacter> {
    this.characters.push(character)
    await this.saveToFile()
    return character
  }

  validateCharacter(character: any): character is ICharacter {
    return (
      typeof character === 'object' &&
      character !== null &&
      typeof character.name === 'string' &&
      typeof character.height === 'string' &&
      typeof character.mass === 'string' &&
      typeof character.hair_color === 'string' &&
      typeof character.skin_color === 'string' &&
      typeof character.eye_color === 'string' &&
      typeof character.birth_year === 'string' &&
      typeof character.gender === 'string' &&
      character.name.trim() !== ''
    )
  }
}

export const characterService = new CharacterService()
