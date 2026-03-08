export interface ICharacter {
  name: string
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
}

export interface CreateCharacterRequest extends Omit<ICharacter, 'name'> {
  name: string
}
