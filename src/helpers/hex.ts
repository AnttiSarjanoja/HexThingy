import { Hex } from '../model/hex'
import { getNeighs } from '../common/helpers'

export const findHex = (hexes: Hex[], { x, y }: { x: number; y: number }) =>
  hexes.find(({ x: xx, y: yy }) => x === xx && y === yy)

export const getNeighHexes = ({ hexes }: { hexes: Hex[] }) => (hex: Hex) => {
  const neighs = getNeighs(hex)
  return hexes.filter(({ x, y }) =>
    neighs.some(({ x: xx, y: yy }) => x === xx && y === yy),
  )
}

export const isHabitable = (h: Hex) =>
  h.resource?.type === 'foods' ||
  h.terrain === 'forest' ||
  h.terrain === 'plains'

export const allowsLos = ({ terrain }: Hex) =>
  terrain === 'plains' || terrain === 'desert' || terrain === 'sea'
