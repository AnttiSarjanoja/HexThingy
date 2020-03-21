import { RNG } from 'rot-js'
import clans from '../../data/animals.json'
import foods from '../../data/resource-foods.json'
import powers from '../../data/resource-powers.json'
import riches from '../../data/resource-riches.json'
import strategic from '../../data/resource-strategic.json'
import terrain from '../../data/terrain.json'
import { Hex } from '../model/hex'
import { Warrior } from '../model/warrior'

const resources = {
  foods,
  strategic,
  riches,
  powers,
} as Record<string, any>

export const insertResource = (hex: Hex) => {
  const type = RNG.getWeightedValue(
    (terrain as any)[hex.terrain.type].resources.rng,
  ) as Hex['resource']['type']
  const subTypes = (terrain as any)[hex.terrain.type].resources[type] as any[]
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
    name: `Warriors of the ${hex.clan.name} clan`,
    buffs: [],
  }
  hex.warriors = [warrior]
  hex.clan.warrior = warrior
}
