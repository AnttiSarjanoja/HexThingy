import { Hex } from './hex'
import { GameMap, Tribe } from './map'
import { Region } from './region'

export type Order = {
  type: string
  owner: Tribe
  issuer: string // TODO Leader
  target: Hex | Region
}

export type Turn = {
  orders: Order[]
}

// NOTE: Not a user
export type Player = {
  name: string
  tribe: Tribe
}

export type Game = {
  turns: Turn[]
  map: GameMap
  players: Player[]
}
