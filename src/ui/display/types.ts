import { UIMapData, UIMapInteractions } from '../types'

export type GameDisplay = {
  getCanvas: () => HTMLElement
  cameraMove: (delta: Coord) => void
  cameraZoom: (delta: { delta: number }) => void
  cameraRotate: (delta: { delta: number }) => void
  renderMks: (data: UIMapData, uiData: UIMapInteractions) => void
  renderTerrains: (data: UIMapData, uiData: UIMapInteractions) => void
}

type Coord = {
  x: number
  y: number
}

export type GameDisplayCreator = (props: {
  data: UIMapData
  onMouseMove: ({ x, y }: Coord) => void
  onMouseClick: ({ x, y }: Coord) => void
}) => GameDisplay
