import { Tribe } from './map'
import { Order } from './order'

type MessageType = 'default' | 'debug' | 'error'

export type Message = {
  sender?: Player // undefined === system
  receiver: Player
  type: MessageType
  title: string
  content: string
  time: string // TODO: What format?
}

// NOTE: Not a user
export type Player = {
  name: string
  tribe: Tribe
  messages: Message[]
  currentOrders: Order[]
}
