import { Display, FOV, RNG } from 'rot-js'
import {
  WIDTH,
  HEIGHT,
  MID,
  REGION_HEXES,
  TOTAL,
  REGION_MIN,
  LOSDIST,
} from './constants'

const regions = getRegions()
const savedHexes = regions.reduce((a, c) => [...a, ...c.hexes], [] as Hex[])

const DISPLAY = getDisplay(savedHexes)
init(DISPLAY)

const rand = (max: number) => (RNG.getUniform() * max) | 0

// beasties

import { Region } from './model/region'
import { Hex } from './model/Hex'
import { getDisplay, renderMks, colorBg } from './display'
import { init, render } from './ui'

// 1) Generate foods / terrain
// 2) Get starting locations
// 3) Generate beasties

regions.forEach(({ hexes }) => {
  const hex = RNG.getItem(hexes)
  const beast = getBeast()
  hex.beast = beast
  hex.resource = { type: 'undiscovered', char: '?' }

  const resourceMax = hexes.length - Math.max((hexes.length / 3) | 0, 1)
  const resourceMin = (hexes.length / 2) | 0
  const amt = Math.min(rand(resourceMax - resourceMin) + resourceMin, 5)
  // console.log(amt + ' ' + hexes.length)
  const chosen = RNG.shuffle(hexes.filter(v => v !== hex)).slice(0, amt)
  // console.log(chosen)
  const clansAmt = Math.min(rand((hexes.length / 3) | 0), 3)
  chosen.forEach((h, i) => {
    insertResource(h)
    if (i < clansAmt) {
      insertClan(h)
    }
  })
})

import terrain from '../data/terrain.json'
import { getRegions } from './generator/region'
import { getBeast } from './generator/beast'
import { insertResource, insertClan } from './generator/hex'

savedHexes.forEach(h => {
  if (!h.resource || !!h.beast) {
    const trn = RNG.getWeightedValue(terrain.rng)
    h.terrain = { type: trn, char: (terrain as any)[trn].char }
  }
})

render(DISPLAY, regions)
console.info(
  `Generated ${savedHexes.length} / ${TOTAL} hexes and ${regions.length} regions`,
)
