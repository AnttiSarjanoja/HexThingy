export type UIOrder = {
  type: string
  x: number
  y: number
}

export type GameActions = {
  endTurn: VoidFunction
  addOrder: (uiOrder: UIOrder, payload: any) => void

  // Only used with debug mode
  debug: {
    toggleChosenTribe: VoidFunction
  }
}

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
  order?: {
    type: string
  }
}>

// TODO: More complex data for pixi-js
// * units
// * clans
// *
