import { Display } from 'rot-js'
import { RenderData } from '../../types'
import { GameDisplayCreator } from '../types'
import { addToColor, multiplyColor } from './helpers'

const displayOptions = {
  spacing: 3,
  layout: 'hex' as const,
  transpose: true,
}

const dimNotSeen = (color: string) => multiplyColor(color, 0.3)

export const createDisplay: GameDisplayCreator = ({
  data,
  onMouseClick,
  onMouseMove,
}) => {
  const maxX = data.reduce((a, c) => (c.x > a ? c.x : a), 0) + 1
  const maxY = data.reduce((a, c) => (c.y > a ? c.y : a), 0) + 1
  const display = new Display({ ...displayOptions, width: maxX, height: maxY })

  display.getContainer().addEventListener('mousemove', evt => {
    const [x, y] = display.eventToPosition(evt)
    onMouseMove({ x, y })
  })

  display.getContainer().addEventListener('mousedown', evt => {
    const [x, y] = display.eventToPosition(evt)
    onMouseClick({ x, y })
  })

  const colorBg = () => {
    const { width, height } = display.getOptions()
    // color all background hexes
    for (let y = 0; y < height; y++) {
      for (let x = y % 2; x < width; x += 2) {
        display.draw(x, y, x + ',' + y, '#114', '#003')
      }
    }
  }

  return {
    getCanvas: () => display.getContainer(),
    cameraMove: _ => {
      // Not implemented
      return
    },
    cameraZoom: _ => {
      // Not implemented
      return
    },
    cameraRotate: _ => {
      // Not implemented
      return
    },
    renderMks: (data, { chosenHex }) => {
      colorBg()
      data.forEach(hex => {
        const { x, y, inLos, terrain, regionColor, units, order } = hex
        const isChosen = x === chosenHex?.x && y === chosenHex?.y
        const textColor = inLos ? addToColor(regionColor, 2) : regionColor
        const usedColor = isChosen
          ? '#f00'
          : order
          ? '#0ff'
          : inLos
          ? regionColor || terrain.color
          : dimNotSeen(regionColor || terrain.color)
        if (units.length) {
          display.draw(x, y, units[0].char, units[0].textColor, usedColor)
        } else if (terrain.resource) {
          display.draw(x, y, terrain.resource.char, '#dd0', usedColor)
        } else {
          display.draw(x, y, terrain.char, textColor, usedColor)
        }
      })
    },
    renderTerrains: (data: RenderData) => {
      colorBg()
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
    },
  }
}
