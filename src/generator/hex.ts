import { RNG } from 'rot-js'
import clans from '../../data/animals.json'
import foods from '../../data/resource-foods.json'
import powers from '../../data/resource-powers.json'
import riches from '../../data/resource-riches.json'
import strategic from '../../data/resource-strategic.json'
import terrain from '../../data/terrain.json'
import { Hex } from '../model/hex'
import { Warrior } from '../model/warrior'
import { getNeighs } from '../common/helpers'
import { Coord } from '../common/types'

const resources = {
  foods,
  strategic,
  riches,
  powers,
} as Record<string, any>

export const insertResource = (hex: Hex) => {
  const type = RNG.getWeightedValue(
    (terrain as any)[hex.terrain].resources.rng,
  ) as Hex['resource']['type']
  const subTypes = (terrain as any)[hex.terrain].resources[type] as any[]
  const { debugChar, rng } = resources[type] // , rng
  const usedRng = Object.fromEntries(
    Object.entries(rng).filter(([key]) => subTypes.includes(key)),
  ) as any
  hex.resource = {
    type,
    char: debugChar,
    name: RNG.getWeightedValue(usedRng),
  }
}

export const insertClan = (hex: Hex) => {
  hex.clan = { name: RNG.getItem(clans) }
  const warrior: Warrior = {
    name: `${hex.clan.name}-clan warriors`,
    buffs: [],
  }
  hex.warriors = [warrior]
  hex.clan.warrior = warrior
}

export const getSeaHexes = (hexes: Hex[]) => {
  const taken = hexes as Coord[]

  // TODO: isFree and finding neighbouring coords of given coords should really be a helper
  const isFree = (used: Coord[]) => ({ x, y }: Coord) =>
    !used.find(({ x: xx, y: yy }) => xx === x && yy === y)

  const neighs: Coord[] = taken.reduce(
    (a, c) => [...a, ...getNeighs(c).filter(isFree(taken.concat(a)))],
    [] as Hex[],
  )

  // TODO: just get rid of all horsing around
  const neighsNeighs: Coord[] = taken
    .concat(neighs)
    .reduce(
      (a, c) => [
        ...a,
        ...getNeighs(c).filter(isFree(taken.concat(neighs).concat(a))),
      ],
      [] as Hex[],
    )

  return neighs.concat(neighsNeighs).map(
    ({ x, y }) =>
      ({
        x,
        y,
        terrain: 'sea',
      } as Hex),
  )
}
