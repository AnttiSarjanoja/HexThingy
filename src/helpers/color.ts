const addToChar = (char: string, amount: number) =>
  Math.max(Math.min(parseInt(char, 16) + amount, 15), 0).toString(16)

export const addToColor = (color: string, amount: number) =>
  [...color].map((v, i) => (i > 0 ? addToChar(v, amount) : v)).join('')

// TODO: Unit tests
// (addToColor('#123', 4))
// (addToColor('#089', 9))
// (addToColor('#123', -1))
// (addToColor('#123', -4))
// (addToColor('#112233', 4))
// (addToColor('#008899', 9))
// (addToColor('#112233', -1))
// (addToColor('#112233', -4))