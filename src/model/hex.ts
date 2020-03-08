import { Clan } from './clan'
import { Warrior } from './warrior'

type Resource = {
  type: string
  name: string
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
  beast?: string
  clan?: Clan
  resource?: Resource
  warriors?: Warrior[]
}
