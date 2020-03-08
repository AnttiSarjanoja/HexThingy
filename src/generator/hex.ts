import { RNG } from 'rot-js'
import clans from '../../data/animals.json'
import foods from '../../data/resource-foods.json'
import powers from '../../data/resource-powers.json'
import riches from '../../data/resource-riches.json'
import strategic from '../../data/resource-strategic.json'
import terrain from '../../data/terrain.json'
import { Hex } from '../model/Hex'

// const resourcesRng = {
//   foods: 3,
//   strategic: 2,
//   riches: 1,
//   powers: 1,
// }

const resources = {
  foods,
  strategic,
  riches,
  powers,
} as Record<string, any>

// const getRandResourceType = () => resources[RNG.getWeightedValue(resourcesRng)]

export const insertResource = (hex: Hex) => {
  const type = RNG.getWeightedValue(
    (terrain as any)[hex.terrain.type].resources.rng,
  )
  const subTypes = (terrain as any)[hex.terrain.type].resources[type] as any[]
  const { debugChar, rng } = resources[type] // , rng
  const usedRng = Object.fromEntries(
    Object.entries(rng).filter(([key]) => subTypes.includes(key)),
  ) as any
  hex.resource = {
    type: RNG.getWeightedValue(usedRng),
    char: debugChar,
    name: type, // Just asdf
  }
}

export const insertClan = (hex: Hex) => {
  hex.clan = { name: RNG.getItem(clans) }
}
