import * as PIXI from 'pixi.js'
import { HEX_HEIGHT, HEX_WIDTH } from './constants'
import { colorToNumber, multiplyColor, addToColor } from './helpers'
import { RenderData } from '../../types'

const coordsToPos = ({ x, y }: { x: number; y: number }) => ({
  x: y * HEX_WIDTH * 0.75, // :(
  y: x * HEX_HEIGHT * 0.5,
})

const dimNotSeen = (color: string) => multiplyColor(color, 0.3)

// TODO: Types
export const getPixiHex = (
  { x, y, inLos, regionColor, terrain, units }: RenderData[0],
  hexTexture: PIXI.Texture,
  onMouseClick: any,
  onMouseMove: any,
) => {
  const container = new PIXI.Container()
  const pos = coordsToPos({ x, y })
  container.x = pos.x
  container.y = pos.y

  const sprite = new PIXI.Sprite(hexTexture)
  sprite.interactive = true
  sprite.buttonMode = true
  sprite.on('pointerdown', () => {
    onMouseClick({ x, y })
  })
  sprite.on('pointerover', () => {
    onMouseMove({ x, y })
  })
  container.addChild(sprite)

  const usedColor = inLos
    ? regionColor || terrain.color
    : dimNotSeen(regionColor || terrain.color)

  const textColor = inLos
    ? addToColor(regionColor || terrain.color, 2)
    : regionColor || terrain.color

  container.removeChildren()
  sprite.tint = colorToNumber(usedColor)
  container.addChild(sprite)

  const terrainChar = new PIXI.Text(terrain.char)

  terrainChar.style = {
    fill: textColor,
    fontSize: 36,
  }

  terrainChar.anchor.set(0.5)
  terrainChar.x = HEX_WIDTH * 0.5
  terrainChar.y = HEX_HEIGHT * 0.5

  container.addChild(terrainChar)

  const unitChars = units?.map((u, i, { length }) => {
    const unitChar = new PIXI.Text(u.char)
    unitChar.style = {
      fill: u.textColor,
      fontSize: 24,
    }

    unitChar.anchor.set(0.5)
    unitChar.x = HEX_WIDTH * 0.5 + (-(length - 1) / 2 + i) * (HEX_WIDTH * 0.2)
    unitChar.y = HEX_HEIGHT * 0.8

    container.addChild(unitChar)
    return unitChar
  })

  let resourceChar = undefined as any
  if (terrain.resource) {
    resourceChar = new PIXI.Text(terrain.resource.char)
    resourceChar.style = {
      fill: '#dddd00',
      fontSize: 24,
    }

    resourceChar.anchor.set(0.5)
    resourceChar.x = HEX_WIDTH * 0.5
    resourceChar.y = HEX_HEIGHT * 0.2

    container.addChild(resourceChar)
  }
  return { container, sprite, terrainChar, unitChars, resourceChar }
}

export const updateUnits = (
  data: RenderData[0],
  hex: ReturnType<typeof getPixiHex>,
) => {
  // TODO: Really a hax for now, maybe units should be on different level than hexes?
  const { units } = data
  const { container, unitChars } = hex

  if (units.length !== unitChars.length) {
    unitChars.forEach(c => container.removeChild(c))
    const newChars = units?.map((u, i, { length }) => {
      const unitChar = new PIXI.Text(u.char)
      unitChar.style = {
        fill: u.textColor,
        fontSize: 24,
      }

      unitChar.anchor.set(0.5)
      unitChar.x = HEX_WIDTH * 0.5 + (-(length - 1) / 2 + i) * (HEX_WIDTH * 0.2)
      unitChar.y = HEX_HEIGHT * 0.8

      container.addChild(unitChar)
      return unitChar
    })
    hex.unitChars = newChars
  }
}

export const renderWithRegionColors = (
  data: RenderData[0],
  hex: ReturnType<typeof getPixiHex>,
) => {
  const { inLos, regionColor, terrain } = data
  const { terrainChar, sprite } = hex

  const usedColor = inLos
    ? regionColor || terrain.color
    : dimNotSeen(regionColor || terrain.color)

  if (sprite.tint !== colorToNumber(usedColor)) {
    sprite.tint = colorToNumber(usedColor)
  }

  const textColor = inLos
    ? addToColor(regionColor || terrain.color, 2)
    : regionColor || terrain.color

  if (terrainChar.style.fill !== textColor) {
    terrainChar.style.fill = textColor
  }

  updateUnits(data, hex)
}

export const renderWithTerrainColors = (
  data: RenderData[0],
  hex: ReturnType<typeof getPixiHex>,
) => {
  const { inLos, terrain } = data
  const { terrainChar, sprite } = hex

  const usedColor = inLos ? terrain.color : dimNotSeen(terrain.color)

  if (sprite.tint !== colorToNumber(usedColor)) {
    sprite.tint = colorToNumber(usedColor)
  }

  const textColor = inLos ? addToColor(terrain.color, 2) : terrain.color

  if (terrainChar.style.fill !== textColor) {
    terrainChar.style.fill = textColor
  }

  updateUnits(data, hex)
}
