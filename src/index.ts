import { getDisplay } from './display'
import { generateMap } from './generator/map'
import { getStartingLocations } from './helpers/map'
import { init, render } from './ui'

const playerAmt = 3

// TODO: This shouldn't be here, refactor generator + helper
const getMap = (): any => {
  const map = generateMap(playerAmt)
  const { name, hexes, regions } = map

  console.info(
    `Generated ${name}: ${hexes.length} hexes and ${regions.length} regions`,
  )

  const startingLocations = getStartingLocations(map)
  if (startingLocations.length < playerAmt) {
    return getMap()
  }
  return { map, startingLocations }
}

const { map, startingLocations } = getMap()

const DISPLAY = getDisplay(map)
init(DISPLAY, map) // TODO: Just somehow else
render(DISPLAY, map)

console.info(`Starting locations`, ...startingLocations)
