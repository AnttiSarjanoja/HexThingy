import { RNG } from 'rot-js'
import { Beast, beastTypes } from '../model/beast'

// TODO: Dynamic imports
import data from '../../data/beasts.json'

const { prefix, infix, suffix } = data.names

// TODO: Move to creation context
// TODO: Gah, this will run out of names in most cases
const usedEpithets: string[] = []

const getName = (type: Beast['type']) => {
  // prettier-ignore
  const trueName = RNG.getPercentage() > 50 ?
    [RNG.getItem(prefix), RNG.getItem(infix), RNG.getItem(suffix)].join('') :
    [RNG.getItem(prefix), RNG.getItem(suffix)].join('')
  const epithet: string = RNG.getItem(
    (data.names.epithets as any)[type]
      .concat(data.names.epithets.default)
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
