// TODO: Rewrite this, mostly PoC code

import { RNG } from 'rot-js'
import regionPrefix from '../../data/region-prefix.json'
import terrain from '../../data/terrain.json'
import { getNeighs, not } from '../common/helpers'
import { Coord } from '../common/types'
import { REGION_HEXES, REGION_MIN } from '../constants'
import { getRandomColor } from '../helpers/color'
import { getNeighHexes, isHabitable } from '../helpers/hex'
import { Hex, TerrainType } from '../model/Hex.js'
import { Region } from '../model/region'
import { getBeast } from './beast'
import { insertClan, insertResource } from './hex'

export const initRegions = (amt: number): Region[] => {
  const taken = [{ x: 0, y: 0 }]
  const isFree = (used = taken) => ({ x, y }: Coord) =>
    !used.find(({ x: xx, y: yy }) => xx === x && yy === y)

  const getNewHex = (reserved: Coord[], takenNeighs: Coord[]): Coord => {
    const neighs: Coord[] = reserved.reduce(
      (a, c) => [...a, ...getNeighs(c).filter(isFree(taken.concat(reserved)))],
      [] as Coord[],
    )
    // NOTE: Find duplicate neighbours and copy them to emphasize choosing them
    const doubles = neighs.filter(
      ({ x, y }, i) =>
        neighs.findIndex(({ x: xx, y: yy }) => x === xx && y === yy) < i,
    )
    const closeToTheLandMass = neighs.filter(({ x, y }) =>
      takenNeighs.find(({ x: xx, y: yy }) => x === xx && y === yy),
    )
    const usedNeighs = neighs.concat(doubles).concat(closeToTheLandMass)
    return RNG.getItem(usedNeighs)
  }

  const reserveRegion = (hexi: Coord): Coord[] => {
    const [randomMax, min] = REGION_HEXES
    const amount = RNG.getUniformInt(0, randomMax) + min
    const retVal = [hexi]
    const takenNeighs =
      taken.length > 1
        ? taken.reduce<Coord[]>(
            (a, c) => [...a, ...getNeighs(c).filter(isFree(taken.concat(a)))],
            [],
          )
        : []

    for (let i = 0; i < amount - 1; i++) {
      const newHex = getNewHex(retVal, takenNeighs)
      if (newHex) {
        retVal.push(newHex)
      } else {
        break
      }
    }
    taken.push(...retVal)
    return retVal
  }

  const findNextFree = (): Coord => {
    const neighs = taken.reduce(
      (a, c) => [...a, ...getNeighs(c).filter(isFree(taken))],
      [] as Coord[],
    )
    return RNG.getItem(neighs)
  }

  const mks = [reserveRegion({ x: 0, y: 0 })]

  const getNeighMks = (hexes: Coord[]) => {
    const neighs: Coord[] = hexes.reduce(
      (a, c) => [
        ...a,
        ...getNeighs(c)
          .filter(isFree(hexes))
          .filter(not(isFree(taken))),
      ],
      [],
    )
    const used = RNG.getItem(neighs)
    return mks.find(mk => !isFree(mk)(used))
  }

  while (mks.length < amt) {
    const generated = reserveRegion(findNextFree())
    if (generated.length < REGION_MIN) {
      const chosen = getNeighMks(generated)
      chosen.push(...generated)
    } else {
      mks.push(generated)
    }
  }

  const regions: Region[] = mks.map(coords => ({
    hexes: coords.map(({ x, y }) => ({
      x,
      y,
      terrain: 'plains',
    })),
    color: getRandomColor(4, 9),
    name: '',
  }))

  const savedHexes = regions.reduce((a, c) => [...a, ...c.hexes], [] as Hex[])

  const getAccessNeighHexes = (hex: Hex) =>
    getNeighHexes({ hexes: savedHexes })(hex).filter(
      h => h.terrain === 'plains',
    )

  let notEnoughTerrainModified = true

  while (notEnoughTerrainModified) {
    const randHex = RNG.getItem(savedHexes)
    const neighs = RNG.shuffle(getAccessNeighHexes(randHex))
    const usedNeighs = neighs.slice(0, neighs.length - 1)
    const trn = RNG.getWeightedValue(terrain.rng)
    const chosen = usedNeighs.slice(0, RNG.getUniformInt(1, 3)).concat(randHex)

    chosen.forEach(h => {
      h.terrain = trn as TerrainType
    })

    notEnoughTerrainModified =
      savedHexes.reduce((a, c) => a + (c.terrain === 'plains' ? 1 : 0), 0) >
      savedHexes.length / 3
  }

  return regions
}

export const populateRegion = (region: Region) => {
  const { hexes } = region

  // Get name
  const trn = Object.entries(
    hexes
      .map(h => h.terrain)
      .reduce((a, c) => ({ ...a, [c]: a[c] ? a[c] + 1 : 1 }), {} as any),
  )
  trn.sort((a, b) => (a[1] < b[1] ? 1 : 0))
  region.name = `The ${RNG.getItem(regionPrefix)} ${trn[0][0]}`

  // Insert region beast on random hex, non-plains preferred
  const freePlains = RNG.getItem(hexes.filter(h => h.terrain === 'plains'))
  const beastHex = RNG.getItem(
    hexes.filter(h => h.terrain !== 'plains').concat(freePlains || []),
  )
  const beast = getBeast()
  beastHex.beast = beast
  beastHex.resource = { type: 'undiscovered', char: '?', name: 'undiscovered' }

  // Generate resources on random hexes
  const resourceMax = hexes.length - Math.max((hexes.length / 2) | 0, 1)
  const resourceMin = (hexes.length / 4) | 0
  const amt = Math.min(
    RNG.getUniformInt(0, resourceMax - resourceMin) + resourceMin,
    4,
  )
  const chosen = RNG.shuffle(hexes.filter(v => v !== beastHex)).slice(0, amt)

  chosen.forEach(h => {
    insertResource(h)
  })

  // Insert clans on region
  const clanRoll = () =>
    hexes.filter(isHabitable).length / (hexes.length * 1.25) > RNG.getUniform()
  const hasClan = clanRoll()
  const isFood = chosen.some(r => r.resource?.type === 'foods') && clanRoll()
  const maxClans = +hasClan + +isFood

  const getInsertedAmt = () => hexes.filter(h => h.clan).length

  // 1) insert clans on food hexes
  chosen
    .filter(h => h.resource?.type === 'foods')
    .forEach(h => {
      if (getInsertedAmt() < maxClans) {
        insertClan(h)
      }
    })

  // 2) insert rest of the clans into habitable resource hexes
  if (getInsertedAmt() < maxClans) {
    hexes
      .filter(h => !h.beast && !h.clan && isHabitable(h) && h.resource)
      .slice(0, maxClans - getInsertedAmt())
      .forEach(h => insertClan(h))
  }

  // 3) insert rest of the clans into habitable hexes if possible
  if (getInsertedAmt() < maxClans) {
    hexes
      .filter(h => !h.beast && !h.clan && isHabitable(h))
      .slice(0, maxClans - getInsertedAmt())
      .forEach(h => insertClan(h))
  }

  return region
}
