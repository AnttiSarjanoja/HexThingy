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

export const areNeighs = ({ x, y }: Coord, { x: xx, y: yy }: Coord) =>
  getNeighs({ x, y }).some(({ x: xxx, y: yyy }) => xx === xxx && yy === yyy)
