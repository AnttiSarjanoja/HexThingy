import { WIDTH, HEIGHT } from '../constants'
import { Display } from 'rot-js'
import { Region } from '../model/region'
import { Hex } from '../model/Hex'

const displayOptions = {
  width: WIDTH, // 5,9,13,17 etc
  height: HEIGHT,
  spacing: 3,
  layout: 'hex' as const,
  transpose: true,
}

export const renderMks = (display: Display, regions: Region[]) =>
  regions.forEach(({ color, hexes }) =>
    hexes.forEach(hex => {
      const { x, y, terrain } = hex
      const textColor = `#${color.map(v => v - 2).join('')}`
      const colori =
        terrain.type !== 'mountains'
          ? `#${color.join('')}`
          : `#${color.map(v => v - 1).join('')}`
      if (hex.beast) {
        display.draw(hex.x, hex.y, 'B', '#000', colori)
      } else if (hex.clan) {
        display.draw(x, y, 'C', '#fff', colori)
      } else if (hex.resource) {
        display.draw(x, y, hex.resource.char, '#dd0', colori)
      } else {
        display.draw(x, y, terrain.char, textColor, colori)
      }
    }),
  )

export const colorBg = (display: Display) => {
  // color all hexes
  for (var y = 0; y < HEIGHT; y++) {
    for (var x = y % 2; x < WIDTH; x += 2) {
      display.draw(x, y, x + ',' + y, '#191919', '#202020')
    }
  }
}

export const getDisplay = (savedHexes: Hex[]) => {
  const display = new Display(displayOptions)
  display.getContainer().addEventListener('mousemove', evt => {
    if (evt instanceof MouseEvent) {
      const [x, y] = display.eventToPosition(evt)
      // console.log(savedHexes.find(({ x: xx, y: yy }) => xx === x && yy === y))
      document.getElementById('moi').textContent = JSON.stringify(
        savedHexes.find(({ x: xx, y: yy }) => xx === x && yy === y),
        undefined,
        2,
      ) //.replace(/\n/g, '<br>')
    }
  })
  return display
}
