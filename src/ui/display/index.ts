// TODO: Needs wrapper for Display to switch between rot and pixi

import { Display } from 'rot-js'
import { addToColor, multiplyColor } from '../../helpers/color'
import { RenderData } from '../types'

const displayOptions = {
  spacing: 3,
  layout: 'hex' as const,
  transpose: true,
}

const dimNotSeen = (color: string) => multiplyColor(color, 0.3)

export const renderMks = (display: Display, data: RenderData) =>
  data.forEach(data => {
    const { x, y, inLos, terrain, regionColor, unit } = data
    const textColor = inLos ? addToColor(regionColor, 2) : regionColor
    const usedColor = inLos ? regionColor : dimNotSeen(regionColor)
    if (unit) {
      display.draw(x, y, unit.char, unit.textColor, usedColor)
    } else if (terrain.resource) {
      display.draw(x, y, terrain.resource.char, '#dd0', usedColor)
    } else {
      display.draw(x, y, terrain.char, textColor, usedColor)
    }
  })

export const renderTerrains = (display: Display, data: RenderData) =>
  data.forEach(data => {
    const { x, y, inLos, terrain } = data
    const textColor = inLos ? addToColor(terrain.color, 2) : terrain.color
    const usedColor = inLos ? terrain.color : dimNotSeen(terrain.color)

    if (terrain.resource) {
      display.draw(
        x,
        y,
        terrain.resource.char,
        addToColor(textColor, 2),
        usedColor,
      )
    } else {
      display.draw(x, y, terrain.char, textColor, usedColor)
    }
  })

export const colorBg = (display: Display) => {
  const { width, height } = display.getOptions()
  // color all background hexes
  for (var y = 0; y < height; y++) {
    for (var x = y % 2; x < width; x += 2) {
      display.draw(x, y, x + ',' + y, '#114', '#003')
    }
  }
}

export const newDisplay = (data: RenderData) => {
  const maxX = data.reduce((a, c) => (c.x > a ? c.x : a), 0) + 1
  const maxY = data.reduce((a, c) => (c.y > a ? c.y : a), 0) + 1

  const display = new Display({ ...displayOptions, width: maxX, height: maxY })
  return display
}
