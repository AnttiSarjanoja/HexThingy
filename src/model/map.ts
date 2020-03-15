import { Hex } from './hex'
import { Region } from './region'
import { Clan } from './clan'

export type Tribe = {
  name: string
  clans: Clan[] // TODO: replace regions with ids when saving
}

export type GameMap = {
  regions: Region[]
  hexes: Hex[]
  tribes: Tribe[]
  name: string
}
