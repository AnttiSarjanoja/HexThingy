export type UIOrder = {
  type: string
  x: number
  y: number
}

export type GameActions = {
  addOrder: (props: { uiOrder: UIOrder; orderData: any }) => void
  endTurn: VoidFunction

  // Only used with debug mode
  debugToggleChosenTribe: VoidFunction
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
  units: Array<{
    type: string
    name: string
    char: string
    textColor: string
    owner?: string
  }>
  order?: {
    type: string
  }
}>

export type UIData = {
  chosenHex?: { x: number; y: number }
}

// TODO: More complex data
// * units (all info)
// * clans (all info)
