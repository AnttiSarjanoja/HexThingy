import { getDisplay } from './display'
import { generateMap } from './generator/map'
import { getNeighRegions } from './helpers/region'
import { init, render } from './ui'

const { savedHexes, regions } = generateMap(3)

const DISPLAY = getDisplay(savedHexes, regions)
init(DISPLAY, regions, savedHexes) // TODO: Just somehow else
render(DISPLAY, regions, savedHexes)

console.info(
  `Generated ${savedHexes.length} hexes and ${regions.length} regions`,
)

const startingLocationCandidates = regions.filter(
  r => r.hexes.filter(h => h.clan).length > 1,
)

// TODO: Come up with a better word than *neigh*
const neighRegions = getNeighRegions(savedHexes, regions)

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
  .slice(0, 3)

console.info(`Starting locations`, ...bestStartingLocations)
