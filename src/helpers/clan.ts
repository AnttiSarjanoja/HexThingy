import { Clan } from '../model/clan'
import { Hex } from '../model/hex'

export const getClanHex = (hexes: Hex[]) => (clan: Clan) =>
  hexes.find(h => h.clan === clan)
