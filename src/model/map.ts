import { Hex } from './hex'
import { Region } from './region'

export type GameMap = {
  regions: Region[]
  hexes: Hex[]
  tribes: string[] // TODO: Tribe[]
  name: string
}
