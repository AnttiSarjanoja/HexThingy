import { Clan } from './clan'
import { Warrior } from './warrior'
import { Beast } from './beast'

type Resource = {
  type: 'foods' | 'powers' | 'riches' | 'strategic' | 'undiscovered'
  name: string // aka subtype
  char: string
}

export type TerrainType =
  | 'plains'
  | 'forest'
  | 'mountains'
  | 'swamp'
  | 'desert'
  | 'sea'

export type Hex = {
  x: number
  y: number
  terrain: TerrainType
  beast?: Beast
  clan?: Clan
  resource?: Resource
  warriors?: Warrior[]
}
