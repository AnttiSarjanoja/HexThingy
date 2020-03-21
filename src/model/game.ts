import { GameMap } from './map'
import { Order } from './order'
import { Player } from './player'
import { RNG } from 'rot-js'

export type Turn = {
  orders: Order[]
  rngState: ReturnType<typeof RNG.getState>
}

export type Game = {
  turns: Turn[]
  map: GameMap
  players: Player[]
}
