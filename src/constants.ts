const WIDTH = 31 // Asdf, is actually height
const HEIGHT = 19
const TOTAL = ((WIDTH / 2) | 0) * HEIGHT + ((HEIGHT / 2) | 0) + 1
const REGION_HEXES = [4, 6]
const REGION_MIN = 3
const MID = [(WIDTH / 2) | 0, (HEIGHT / 2) | 0] as [number, number]
const LOSDIST = 3

export { WIDTH, HEIGHT, TOTAL, REGION_HEXES, REGION_MIN, MID, LOSDIST }
