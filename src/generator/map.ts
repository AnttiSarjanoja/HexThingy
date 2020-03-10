import { initRegions, populateRegion } from './region'
import { Hex } from '../model/Hex'
import { REGIONS_PER_PLAYER, REGIONS_BASE_AMOUNT } from '../constants'

export const generateMap = (playerAmount: number) => {
  const regions = initRegions(
    playerAmount * REGIONS_PER_PLAYER + REGIONS_BASE_AMOUNT,
  ).map(populateRegion)
  const savedHexes = regions.reduce((a, c) => [...a, ...c.hexes], [] as Hex[])

  // NOTE: regions are generated from [0,0] so the hex coordinates must be manually configured above zero
  const minX = savedHexes.reduce((a, c) => (c.x < a ? c.x : a), 0)
  const minY = savedHexes.reduce((a, c) => (c.y < a ? c.y : a), 0)

  // NOTE: this usedX fix is only needed with rot-js display mouseover, can be removed when pixi.js or alternative display is used
  const usedMinX = (minX + minY) % 2 === 0 ? minX : minX - 1

  savedHexes.forEach(h => {
    h.x -= usedMinX
    h.y -= minY
  })

  return { savedHexes, regions }
}
