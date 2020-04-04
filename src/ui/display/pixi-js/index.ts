import * as PIXI from 'pixi.js'
import { UIMapData } from '../../types'
import { GameDisplayCreator } from '../types'
import { HEX_HEIGHT, HEX_WIDTH } from './constants'
import { colorToNumber } from './helpers'
import {
  getPixiHex,
  renderWithRegionColors,
  renderWithTerrainColors,
} from './hex-sprite'

const getHexTexture = (app: PIXI.Application) => {
  const graphics = new PIXI.Graphics()
  graphics.beginFill(0xffffff)
  graphics.moveTo(HEX_WIDTH, HEX_HEIGHT / 2)
  graphics.lineTo(HEX_WIDTH * 0.75, HEX_HEIGHT)
  graphics.lineTo(HEX_WIDTH * 0.25, HEX_HEIGHT)
  graphics.lineTo(0, HEX_HEIGHT / 2)
  graphics.lineTo(HEX_WIDTH * 0.25, 0)
  graphics.lineTo(HEX_WIDTH * 0.75, 0)
  graphics.closePath()
  graphics.endFill()
  return app.renderer.generateTexture(
    graphics,
    PIXI.SCALE_MODES.NEAREST,
    window.devicePixelRatio,
  )
}

const getChosenHexSprite = () => {
  const graphics = new PIXI.Graphics()
  graphics.lineStyle(8, colorToNumber('#f00'))
  graphics.moveTo(HEX_WIDTH, HEX_HEIGHT / 2)
  graphics.lineTo(HEX_WIDTH * 0.75, HEX_HEIGHT)
  graphics.lineTo(HEX_WIDTH * 0.25, HEX_HEIGHT)
  graphics.lineTo(0, HEX_HEIGHT / 2)
  graphics.lineTo(HEX_WIDTH * 0.25, 0)
  graphics.lineTo(HEX_WIDTH * 0.75, 0)
  graphics.closePath()
  graphics.endFill()
  return graphics
}

// const filterChosenHex = new FILTERS.OutlineFilter(2, 0xff0000) //new PIXI.filters.OutlineFilter(2, 0x99ff99);

export const createDisplay: GameDisplayCreator = ({
  data: startData,
  onMouseClick,
  onMouseMove,
}) => {
  const maxHeight =
    (startData.reduce((a, c) => (c.x > a ? c.x : a), 0) + 2) * HEX_HEIGHT * 0.5
  const maxWidth =
    (startData.reduce((a, c) => (c.y > a ? c.y : a), 0) + 1) *
      HEX_WIDTH *
      0.75 +
    HEX_WIDTH * 0.25

  const app = new PIXI.Application({
    resizeTo: window.document.body, // TODO: What to really use?
  })
  const hexTexture = getHexTexture(app)
  const mapContainer = new PIXI.Container()
  mapContainer.scale.set(0.3)
  mapContainer.x = app.view.width / 2
  mapContainer.y = app.view.height / 2
  mapContainer.pivot.x = maxWidth / 2
  mapContainer.pivot.y = maxHeight / 2

  app.stage.addChild(mapContainer)

  const pixiHexes = {} as Record<string, ReturnType<typeof getPixiHex>>
  startData.forEach(d => {
    const pixiHex = getPixiHex(d, hexTexture, onMouseClick, onMouseMove)
    pixiHexes[d.x + ' ' + d.y] = pixiHex
    mapContainer.addChild(pixiHex.container)
  })
  const toPixiHex = ({ x, y }: UIMapData[0]) => pixiHexes[x + ' ' + y]

  const chosenSprite = getChosenHexSprite()

  return {
    getCanvas: () => app.view,
    cameraMove: ({ x, y }) => {
      mapContainer.x += x
      mapContainer.y += y
    },
    cameraZoom: ({ delta }) => {
      mapContainer.scale.x = Math.max(mapContainer.scale.x + delta, 0.1)
      mapContainer.scale.y = Math.max(mapContainer.scale.y + delta, 0.1)
    },
    cameraRotate: ({ delta }) => {
      mapContainer.angle += delta
    },
    renderMks: (data, { chosenHex }) => {
      mapContainer.removeChild(chosenSprite)
      data.forEach(hex => {
        const { x, y } = hex
        const { container } = toPixiHex(hex)

        renderWithRegionColors(hex, toPixiHex(hex))

        const isChosen = x === chosenHex?.x && y === chosenHex?.y
        if (isChosen) {
          // TODO: Not very sophisticated but works for now
          mapContainer.addChild(chosenSprite)
          chosenSprite.x = container.x
          chosenSprite.y = container.y
        }
      })
    },
    renderTerrains: (data, { chosenHex }) => {
      data.forEach(hex => {
        const { x, y } = hex
        const { container } = toPixiHex(hex)

        renderWithTerrainColors(hex, toPixiHex(hex))

        const isChosen = x === chosenHex?.x && y === chosenHex?.y
        if (isChosen) {
          // TODO: Not very sophisticated but works for now
          mapContainer.removeChild(chosenSprite)
          mapContainer.addChild(chosenSprite)
          chosenSprite.x = container.x
          chosenSprite.y = container.y
        }
      })
    },
  }
}
