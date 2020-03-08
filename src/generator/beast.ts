import { RNG } from 'rot-js'
import prefix from '../../data/beast-prefix.json'
import suffix from '../../data/beast-suffix.json'

export const getBeast = () =>
  [RNG.getItem(prefix), RNG.getItem(suffix)].join('')
