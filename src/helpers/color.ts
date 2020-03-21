import { RNG } from 'rot-js'

const addToChar = (char: string, amount: number) =>
  Math.max(Math.min(parseInt(char, 16) + amount, 15), 0).toString(16)

const multiplyChar = (char: string, amount: number) =>
  Math.max(Math.min((parseInt(char, 16) * amount) | 0, 15), 0).toString(16)

export const addToColor = (color: string, amount: number) =>
  [...color].map((v, i) => (i > 0 ? addToChar(v, amount) : v)).join('')

export const multiplyColor = (color: string, amount: number) =>
  [...color].map((v, i) => (i > 0 ? multiplyChar(v, amount) : v)).join('')

export const getRandomColor = (min: number = 0, max: number = 15) =>
  `#${Array(6)
    .fill(0)
    .map(_ => RNG.getUniformInt(min, max).toString(16))
    .join('')}`

// TODO: Unit tests
// (addToColor('#123', 4))
// (addToColor('#089', 9))
// (addToColor('#123', -1))
// (addToColor('#123', -4))
// (addToColor('#112233', 4))
// (addToColor('#008899', 9))
// (addToColor('#112233', -1))
// (addToColor('#112233', -4))
