import { Clan } from './clan'
import { Warrior } from './warrior'
import { Beast } from './beast'

type Resource = {
  type: 'foods' | 'powers' | 'riches' | 'strategic' | 'undiscovered'
  name: string // aka subtype
  char: string
}

type Terrain = {
  type: string
  char: string
}

export type Hex = {
  x: number
  y: number
  terrain: Terrain
  beast?: Beast
  clan?: Clan
  resource?: Resource
  warriors?: Warrior[]
}
