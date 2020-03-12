import { GameMap } from '../model/map'
import { getNeighRegions } from './region'

export const getStartingLocations = ({ regions, hexes, tribes }: GameMap) => {
  const startingLocationCandidates = regions.filter(
    r => r.hexes.filter(h => h.clan).length > 1,
  )

  // TODO: Come up with a better word than *neigh*
  const neighRegions = getNeighRegions(hexes, regions)

  const bestStartingLocations = startingLocationCandidates
    .slice()
    .sort((a, b) => (neighRegions(a) > neighRegions(b) ? 0 : 1))
    .filter((r, i, a) => {
      // NOTE: Filter out starting locations that are next to each other (remove the latter)
      // TODO: Reeeally needs unit testing
      const neighs = neighRegions(r)
      return a.every(
        rr => rr === r || neighs.every(rrr => rr !== rrr || a.indexOf(rr) < i),
      )
    })
    .slice(0, tribes.length)

  return bestStartingLocations
}
