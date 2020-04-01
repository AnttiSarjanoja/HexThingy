import { initRegions, populateRegion } from './region'
import { Hex } from '../model/hex'
import { GameMap } from '../model/map'
import { REGIONS_PER_PLAYER, REGIONS_BASE_AMOUNT } from '../constants'
import prefix from '../../data/region-prefix.json'
import suffix from '../../data/map-suffix.json'
import { RNG } from 'rot-js'
import { getSeaHexes } from './hex'

export const generateMap = (playerAmount: number): GameMap => {
  const regions = initRegions(
    playerAmount * REGIONS_PER_PLAYER + REGIONS_BASE_AMOUNT,
  ).map(populateRegion)

  const landHexes = regions.reduce((a, c) => [...a, ...c.hexes], [] as Hex[])
  const seaHexes = getSeaHexes(landHexes)
  const hexes = landHexes.concat(seaHexes)

  // NOTE: regions are generated from [0,0] so the hex coordinates must be manually configured above zero
  const minX = hexes.reduce((a, c) => (c.x < a ? c.x : a), 0)
  const minY = hexes.reduce((a, c) => (c.y < a ? c.y : a), 0)

  // NOTE: this usedX fix is only needed with rot-js display mouseover, can be removed when pixi.js or alternative display is used
  const usedMinX = (minX + minY) % 2 === 0 ? minX : minX - 1

  hexes.forEach(h => {
    h.x -= usedMinX
    h.y -= minY
  })

  return {
    hexes,
    regions,
    tribes: Array(playerAmount).fill(''),
    name: `The ${RNG.getItem(prefix)} ${RNG.getItem(suffix)}`,
  }
}
