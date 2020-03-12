import { Hex } from '../model/hex'

type Coord = { x: number; y: number }

export const getNeighs = ({ x, y }: Coord): Coord[] =>
  [
    { x: x - 1, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 2, y: y },
    { x: x + 2, y: y },
    { x: x - 1, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ] as Coord[]

export const getNeighHexes = (hexes: Hex[]) => (hex: Hex) => {
  const neighs = getNeighs(hex)
  return hexes.filter(({ x, y }) =>
    neighs.some(({ x: xx, y: yy }) => x === xx && y === yy),
  )
}
