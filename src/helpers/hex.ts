import { Hex } from '../model/hex'

type Coord = { x: number; y: number }

export const getHex = (hexes: Hex[], { x, y }: { x: number; y: number }) =>
  hexes.find(({ x: xx, y: yy }) => x === xx && y === yy)

export const getNeighs = ({ x, y }: Coord): Coord[] =>
  [
    { x: x - 1, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 2, y: y },
    { x: x + 2, y: y },
    { x: x - 1, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ] as Coord[]

export const getNeighHexes = ({ hexes }: { hexes: Hex[] }) => (hex: Hex) => {
  const neighs = getNeighs(hex)
  return hexes.filter(({ x, y }) =>
    neighs.some(({ x: xx, y: yy }) => x === xx && y === yy),
  )
}

export const isHabitable = (h: Hex) =>
  h.resource?.type === 'foods' ||
  h.terrain.type === 'forest' ||
  h.terrain.type === 'plains'

export const allowsLos = ({ terrain: { type } }: Hex) =>
  type === 'plains' || type === 'desert'
