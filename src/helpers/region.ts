import { getNeighHexes } from './hex'
import { Region } from '../model/region'
import { Hex } from '../model/hex'

export const getNeighRegions = (hexes: Hex[], regions: Region[]) => (
  r: Region,
) => {
  const neighHexes = getNeighHexes(hexes)

  return r.hexes
    .reduce(
      (a, h) => [
        ...a,
        ...neighHexes(h).map(neigh =>
          regions.find(r => r.hexes.some(hex => hex === neigh)),
        ),
      ],
      [],
    )
    .filter((r, i, a) => a.indexOf(r) === i)
}
