import { Hex } from './hex'
import { Region } from './region'
import { Tribe } from './map'

export const orders = [
  'move',
  'settle',
  'advancement',
  'build',
  'tithe',
  'magic',
] as const

export type OrderType = typeof orders[number]

export type Order = {
  type: OrderType
  owner: Tribe
  issuer: string // TODO Leader
  target: Hex | Region
  payload: any
}
