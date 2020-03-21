import { RNG } from 'rot-js'
import infix from '../../data/beast-name-infix.json'
import prefix from '../../data/beast-name-prefix.json'
import suffix from '../../data/beast-name-suffix.json'
import { Beast, beastTypes } from '../model/beast'
import beastData from '../../data/beasts.json'

const getName = (type: Beast['type']) => {
  // prettier-ignore
  const trueName = RNG.getPercentage() > 50 ?
    [RNG.getItem(prefix), RNG.getItem(infix), RNG.getItem(suffix)].join('') :
    [RNG.getItem(prefix), RNG.getItem(suffix)].join('')
  const epithet = RNG.getItem(
    (beastData as any)[type].epithets.concat(
      (beastData as any).default.epithets,
    ),
  )

  return `${trueName} the ${epithet}`
}

export const getBeast = (): Beast => {
  const type = RNG.getItem(beastTypes)
  return {
    name: getName(type),
    type,
  }
}
