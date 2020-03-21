import { RNG } from 'rot-js'
import infix from '../../data/beast-name-infix.json'
import prefix from '../../data/beast-name-prefix.json'
import suffix from '../../data/beast-name-suffix.json'
import { Beast, beastTypes } from '../model/beast'
import beastData from '../../data/beasts.json'

// TODO: Move to creation context
// TODO: Gah, this will run out of names in most cases
const usedEpithets: string[] = []

const getName = (type: Beast['type']) => {
  // prettier-ignore
  const trueName = RNG.getPercentage() > 50 ?
    [RNG.getItem(prefix), RNG.getItem(infix), RNG.getItem(suffix)].join('') :
    [RNG.getItem(prefix), RNG.getItem(suffix)].join('')
  const epithet: string = RNG.getItem(
    (beastData as any)[type].epithets
      .concat((beastData as any).default.epithets)
      .filter((v: string) => usedEpithets.indexOf(v) === -1),
  )
  usedEpithets.push(epithet)

  return `${trueName} the ${epithet}`
}

export const getBeast = (): Beast => {
  const type = RNG.getItem(beastTypes)
  return {
    name: getName(type),
    type,
  }
}
