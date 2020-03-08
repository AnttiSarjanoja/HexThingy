import { RNG } from 'rot-js'
import clans from '../../data/animals.json'
import foods from '../../data/resource-foods.json'
import powers from '../../data/resource-powers.json'
import riches from '../../data/resource-riches.json'
import strategic from '../../data/resource-strategic.json'
import { Hex } from '../model/Hex'

const resourcesRng = {
  foods: 3,
  strategic: 2,
  riches: 1,
  powers: 1,
}

const resources = {
  foods,
  strategic,
  riches,
  powers,
} as Record<string, any>

const getRandResourceType = () => resources[RNG.getWeightedValue(resourcesRng)]

export const insertResource = (hex: Hex) => {
  const { debugChar, rng } = getRandResourceType()
  hex.resource = { type: RNG.getWeightedValue(rng), char: debugChar }
}

export const insertClan = (hex: Hex) => {
  hex.clan = { name: RNG.getItem(clans) }
}
