import { GameMap } from './map'
import { Order } from './order'
import { Player } from './player'

export type Turn = {
  orders: Order[]
}

export type Game = {
  turns: Turn[]
  map: GameMap
  players: Player[]
}
