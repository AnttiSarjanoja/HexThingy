import { RenderData, UIData } from '../types'

export type GameDisplay = {
  getCanvas: () => HTMLElement
  cameraMove: (delta: Coord) => void
  cameraZoom: (delta: { delta: number }) => void
  cameraRotate: (delta: { delta: number }) => void
  renderMks: (data: RenderData, uiData: UIData) => void
  renderTerrains: (data: RenderData, uiData: UIData) => void
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
