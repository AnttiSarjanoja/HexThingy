import {
  WIDTH,
  HEIGHT,
  MID,
  REGION_HEXES,
  TOTAL,
  REGION_MIN,
} from '../constants'
import { RNG } from 'rot-js'
import { Region } from '../model/region'

type Coord = [number, number]

const getNeighs = ([x, y]: Coord): Coord[] =>
  ([
    [x - 1, y - 1],
    [x + 1, y - 1],
    [x - 2, y],
    [x + 2, y],
    [x - 1, y + 1],
    [x + 1, y + 1],
  ] as Coord[]).filter(
    ([xx, yy]) => xx >= 0 && yy >= 0 && xx < WIDTH && yy < HEIGHT,
  )

const rand = (max: number) => (RNG.getUniform() * max) | 0

const not = (fn: any) => (...params: any) => !fn(...params)

export const getRegions = (): Region[] => {
  // store
  const takenHexes = [MID]
  const isFree = (usedHexes = takenHexes) => ([x, y]: Coord) =>
    !usedHexes.find(([xx, yy]) => xx === x && yy === y)

  const getNewHex = (taken: Coord[]): Coord => {
    const neighs: Coord[] = taken.reduce(
      (a, c) => [
        ...a,
        ...getNeighs(c).filter(isFree(takenHexes.concat(taken))),
      ],
      [] as Coord[],
    )
    // NOTE: Find duplicate neighbours and copy them to emphasize choosing them
    const doubles = neighs.filter(
      (h, i) => neighs.findIndex(hh => h[0] === hh[0] && h[1] === hh[1]) < i,
    )
    const usedNeighs = neighs.concat(doubles)
    return RNG.getItem(usedNeighs)
  }

  const reserveRegion = (hexi: Coord): Coord[] => {
    const [randi, min] = REGION_HEXES
    const amount = rand(randi) + min
    const retVal = [hexi]
    for (var meh = 0; meh < amount - 1; meh++) {
      const newHex = getNewHex(retVal)
      if (newHex) {
        retVal.push(newHex)
      } else {
        break
      }
    }
    takenHexes.push(...retVal)
    return retVal
  }

  const findNextFree = ([x, y]: Coord): Coord => {
    const neighs = getNeighs([x, y])
    const frees = neighs.filter(isFree())
    if (frees.length === 0) {
      return findNextFree(RNG.getItem(neighs))
    } else {
      return RNG.getItem(frees)
    }
  }

  const mks = [reserveRegion(MID)]

  const getNeighMks = (hexes: Coord[]) => {
    const neighs: Coord[] = hexes.reduce(
      (a, c) => [
        ...a,
        ...getNeighs(c)
          .filter(isFree(hexes))
          .filter(not(isFree(takenHexes))),
      ],
      [],
    )
    const used = RNG.getItem(neighs)
    return mks.find(mk => !isFree(mk)(used))
  }

  while (takenHexes.length < TOTAL / 2) {
    const generated = reserveRegion(findNextFree(MID))
    if (generated.length < REGION_MIN) {
      const chosen = getNeighMks(generated)
      chosen.push(...generated)
    } else {
      mks.push(generated)
    }
  }

  return mks.map(coords => ({
    hexes: coords.map(([x, y]) => ({
      x,
      y,
      terrain: { type: 'plains', char: '_' },
    })),
    color: [rand(6) + 3, rand(6) + 3, rand(6) + 3],
  }))
}
