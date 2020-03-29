const addToChar = (char: string, amount: number) =>
  Math.max(Math.min(parseInt(char, 16) + amount, 15), 0).toString(16)

const multiplyChar = (char: string, amount: number) =>
  Math.max(Math.min((parseInt(char, 16) * amount) | 0, 15), 0).toString(16)

export const addToColor = (color: string, amount: number) =>
  [...color].map((v, i) => (i > 0 ? addToChar(v, amount) : v)).join('')

export const multiplyColor = (color: string, amount: number) =>
  [...color].map((v, i) => (i > 0 ? multiplyChar(v, amount) : v)).join('')
