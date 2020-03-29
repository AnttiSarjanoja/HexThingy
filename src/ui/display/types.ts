import { RenderData, UIData } from '../types'

export type GameDisplay = {
  getCanvas: () => HTMLElement
  colorBg: VoidFunction
  renderMks: (data: RenderData, uiData: UIData) => void
  renderTerrains: (data: RenderData) => void
}

type Coord = {
  x: number
  y: number
}

export type GameDisplayCreator = (props: {
  data: RenderData
  onMouseMove: ({ x, y }: Coord) => void
  onMouseClick: ({ x, y }: Coord) => void
}) => GameDisplay
