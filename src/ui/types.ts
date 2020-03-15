export type RenderData = Array<{
  x: number
  y: number
  inLos: boolean
  regionName: string
  regionColor: string
  terrain: {
    type: string
    color: string
    char: string
    resource?: {
      name: string
      type: string
      char: string
    }
  }
  unit?: {
    type: string
    name: string
    char: string
    textColor: string
  }
}>

// TODO: More complex data for pixi-js
// * units
// * clans
// *
