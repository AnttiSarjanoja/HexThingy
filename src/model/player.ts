import { Tribe } from './map'

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
}
