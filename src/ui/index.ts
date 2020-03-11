// TODO: This file is full on sheit

import { Display, FOV } from 'rot-js'
import { colorBg, drawFov, renderMks, renderTerrains } from '../display'
import { Hex } from '../model/Hex'
import { Region } from '../model/region'

let mode = 0
let fov = false
let iii = 0

export const init = (display: Display, regions: Region[], hexes: Hex[]) => {
  document.getElementById('root').appendChild(display.getContainer())
  const divi = document.createElement('div')
  divi.style.whiteSpace = 'pre'
  divi.id = 'moi'
  document.getElementById('root').appendChild(divi)

  document.onkeydown = checkKey

  function checkKey(e: KeyboardEvent) {
    console.debug(e.key)
    if (e.key === 'v') {
      mode = (mode + 1) % 2
      render(display, regions, hexes)
    }
    if (e.key === 'f') {
      fov = !fov
      render(display, regions, hexes, regions[iii])
    }
    if (e.key === 'i') {
      iii = (iii + 1) % regions.length
      render(display, regions, hexes, regions[iii])
    }
  }
}

const allowsLos = ({ terrain: { type } }: Hex) =>
  type === 'plains' || type === 'desert'

export const render = (
  display: Display,
  regions: Region[],
  hexes: Hex[],
  fovRegion?: Region,
) => {
  colorBg(display)
  if (!mode) {
    renderMks(display, regions)
    if (fov) {
      const fovi = new FOV.PreciseShadowcasting(
        (x: number, y: number) => {
          if (
            fovRegion.hexes.some(({ x: xx, y: yy }) => x === xx && y === yy)
          ) {
            return true
          }
          const hexi = hexes.find(({ x: xx, y: yy }) => x === xx && y === yy)
          // console.log(hexi, x, y)
          return hexi ? allowsLos(hexi) : true
        },
        {
          topology: 6,
        },
      )
      fovRegion.hexes.forEach(({ x, y }) => {
        fovi.compute(x, y, 3, (xx: any, yy: any, r: any, vis: any) => {
          const hex = hexes.find(
            ({ x: xxx, y: yyy }) => xx === xxx && yy === yyy,
          )
          if (hex) {
            const regioni = regions.find(({ hexes }) =>
              hexes.some(hexox => hexox === hex),
            )
            drawFov(display, regioni, hex)
          }
        })
      })
    }
  } else {
    renderTerrains(display, regions)
  }
}

// if (USE_FOV) {
//   document.onkeydown = checkKey
// }

// function checkKey(e: KeyboardEvent) {
//   if (e.keyCode === 38) {
//     // up arrow
//     loc[0] = loc[0] - 2
//   } else if (e.keyCode === 40) {
//     // down arrow
//     loc[0] = loc[0] + 2
//   } else if (e.keyCode === 33) {
//     // pageup
//     loc[0] = loc[0] - 1
//     loc[1] = loc[1] - 1
//   } else if (e.keyCode === 34) {
//     // pagedown
//     loc[0] = loc[0] - 1
//     loc[1] = loc[1] + 1
//   } else if (e.keyCode === 37) {
//     // left arrow
//     loc[0] = loc[0] + 1
//     loc[1] = loc[1] - 1
//   } else if (e.keyCode === 39) {
//     // right arrow
//     loc[0] = loc[0] + 1
//     loc[1] = loc[1] + 1
//   }
//   render()
// }
