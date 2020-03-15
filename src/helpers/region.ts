import { Hex } from '../model/hex'
import { Region } from '../model/region'
import { getNeighHexes } from './hex'

type Props = {
  regions: Region[]
  hexes: Hex[]
}

export const getNeighRegions = ({ regions, hexes }: Props) => (r: Region) => {
  const neighHexes = getNeighHexes({ hexes })

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

export const instancifyIds = (regions: Region[], ids: string[]) =>
  ids.map(s => regions.find(r => r.name === s))

export const getRegionsHexes = ({ regions }: { regions: Region[] }) =>
  regions.reduce((a, c) => a.concat(c.hexes), [] as Hex[])
