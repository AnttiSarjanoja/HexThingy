import { getDisplay } from './display'
import { initRegions, populateRegion } from './generator/region'
import { Hex } from './model/Hex'
import { init, render } from './ui'

// 7 * players could be good? + maybe some minimum amount
const regions = initRegions(21).map(populateRegion)
const savedHexes = regions.reduce((a, c) => [...a, ...c.hexes], [] as Hex[])

// NOTE: regions are generated from [0,0] so the hex coordinates must be manually configured above zero
const minX = savedHexes.reduce((a, c) => (c.x < a ? c.x : a), 0)
const minY = savedHexes.reduce((a, c) => (c.y < a ? c.y : a), 0)

// NOTE: this usedX fix is only needed with rot-js display mouseover, can be removed when pixi.js is used
const usedMinX = (minX + minY) % 2 === 0 ? minX : minX - 1

savedHexes.forEach(h => {
  h.x -= usedMinX
  h.y -= minY
})

const DISPLAY = getDisplay(savedHexes)
init(DISPLAY, regions)

render(DISPLAY, regions)
console.info(
  `Generated ${savedHexes.length} hexes and ${regions.length} regions`,
)
