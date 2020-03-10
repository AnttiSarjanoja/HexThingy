import { Display } from 'rot-js'
import terrainData from '../../data/terrain.json'
import { Hex } from '../model/Hex'
import { Region } from '../model/region'
import { addToColor } from '../helpers/color'

const displayOptions = {
  spacing: 3,
  layout: 'hex' as const,
  transpose: true,
}

export const renderMks = (display: Display, regions: Region[]) =>
  regions.forEach(({ color, hexes }) =>
    hexes.forEach(hex => {
      const { x, y, terrain } = hex
      const textColor = addToColor(color, 2)
      if (hex.beast) {
        display.draw(hex.x, hex.y, 'B', '#000', color)
      } else if (hex.clan) {
        display.draw(x, y, 'C', '#fff', color)
      } else if (hex.resource) {
        display.draw(x, y, hex.resource.char, '#dd0', color)
      } else {
        display.draw(x, y, terrain.char, textColor, color)
      }
    }),
  )

export const renderTerrains = (display: Display, regions: Region[]) =>
  regions.forEach(({ hexes }) =>
    hexes.forEach(hex => {
      const { x, y, terrain } = hex
      const { color } = (terrainData as any)[hex.terrain.type]
      if (hex.resource) {
        display.draw(x, y, hex.resource.char, '#dd0', color)
      } else {
        display.draw(x, y, terrain.char, '#fff', color)
      }
    }),
  )

export const colorBg = (display: Display) => {
  const { width, height } = display.getOptions()
  // color all background hexes
  for (var y = 0; y < height; y++) {
    for (var x = y % 2; x < width; x += 2) {
      display.draw(x, y, x + ',' + y, '#114', '#003')
    }
  }
}

export const getDisplay = (savedHexes: Hex[], regions: Region[]) => {
  const maxX = savedHexes.reduce((a, c) => (c.x > a ? c.x : a), 0) + 1
  const maxY = savedHexes.reduce((a, c) => (c.y > a ? c.y : a), 0) + 1

  const display = new Display({ ...displayOptions, width: maxX, height: maxY })
  display.getContainer().addEventListener('mousemove', evt => {
    if (evt instanceof MouseEvent) {
      const [x, y] = display.eventToPosition(evt)
      const regioni = regions.find(r =>
        r.hexes.some(({ x: xx, y: yy }) => xx === x && yy === y),
      )
      const hex = savedHexes.find(({ x: xx, y: yy }) => xx === x && yy === y)
      document.getElementById('moi').textContent = regioni
        ? JSON.stringify(
            {
              region: regioni.name,
              hex,
            },

            undefined,
            2,
          )
        : ''
    }
  })
  return display
}
