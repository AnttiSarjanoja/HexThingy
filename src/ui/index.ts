import { Display, FOV } from 'rot-js'
// import { LOSDIST } from '../constants'
import { colorBg, renderMks } from '../display'
import { Region } from '../model/region'
import { MID } from '../constants'

export const init = (display: Display) => {
  document.getElementById('root').appendChild(display.getContainer())
  const divi = document.createElement('div')
  divi.style.whiteSpace = 'pre'
  divi.id = 'moi'
  document.getElementById('root').appendChild(divi)
}

const USE_FOV = false

// const getHex = (xx: number, yy: number) =>
//   savedHexes.find(({ x, y }) => x === xx && y === yy)

//   const loc = MID

// const fov = new FOV.PreciseShadowcasting(
//   (x: number, y: number) => {
//     if (x === loc[0] && y === loc[1]) {
//       return true
//     }
//     const hexi = getHex(x, y)
//     console.log(hexi, x, y)
//     return hexi ? !!hexi.type : true
//   },
//   {
//     topology: 6,
//   },
// )

export const render = (display: Display, regions: Region[]) => {
  colorBg(display)
  renderMks(display, regions)
  // const hexi = getHex(loc[0], loc[1]);
  // const usedDist = hexi && !!hexi.type ? LOSDIST : 1;
  // if (USE_FOV) {
  //   fov.compute(loc[0], loc[1], LOSDIST, (x: any, y: any, r: any, vis: any) => {
  //     const hex = savedHexes.find(({ x: xx, y: yy }) => xx === x && yy === y)
  //     if (hex) {
  //       const ch = r ? (hex.type ? '*' : '') : '@'
  //       // const chars = hex.color.map(c => (c + 2).toString(16)) // TODO
  //       const chars = [6, 6, 6]
  //       DISPLAY.draw(x, y, ch, '#fff', `#${chars.join('')}`)
  //     }
  //   })
  // }
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
