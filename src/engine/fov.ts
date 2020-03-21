import { FOV } from 'rot-js'
import { Tribe, GameMap } from '../model/map'
import { allowsLos, findHex } from '../helpers/hex'
import { getClanHex } from '../helpers/clan'
import { LOSDIST } from '../constants'
import { Region } from '../model/region'
import { Hex } from '../model/hex'
import { RenderData } from '../ui/types'
import terrainData from '../../data/terrain.json'

// prettier-ignore
const getUnit = ({ beast, clan }: Pick<Hex, 'beast' | 'clan'>) =>
  beast ? { type: 'beast', char: 'B', textColor: '#000', name: beast.name } :
  clan  ? { type: 'clan', char: 'C', textColor: '#fff', name: clan.name } :
  undefined

// TODO: Where to move these get-renderables, model?
const getRenderableHex = (
  region: Region,
  { x, y, terrain, resource, beast, clan }: Hex,
): RenderData[0] => ({
  regionName: region.name,
  regionColor: region.color,
  ...{ x, y },
  terrain: {
    type: terrain.type,
    color: (terrainData as any)[terrain.type].color,
    char: (terrainData as any)[terrain.type].char,
    resource: resource
      ? {
          name: resource.name,
          type: resource.type,
          char: resource.char,
        }
      : undefined,
  },
  inLos: false,
  unit: getUnit({ beast, clan }),
})

export const getRenderData = (
  currentTribe: Tribe,
  { regions, hexes }: GameMap,
): RenderData => {
  const fovHexes = currentTribe.clans.map(getClanHex(hexes))
  const fovi = new FOV.PreciseShadowcasting(
    (x: number, y: number) => {
      const hexi = hexes.find(({ x: xx, y: yy }) => x === xx && y === yy)
      return !hexi || allowsLos(hexi) || fovHexes.includes(hexi)
    },
    {
      topology: 6,
    },
  )
  const retVal = [] as RenderData
  regions.forEach(r =>
    r.hexes.forEach(h => {
      retVal.push(getRenderableHex(r, h))
    }),
  )

  fovHexes.forEach(({ x, y }) => {
    fovi.compute(x, y, LOSDIST, (xx: any, yy: any, r: any, vis: any) => {
      const hex = findHex(hexes, { x: xx, y: yy })
      if (hex) {
        retVal.find(val => val.x === xx && val.y === yy).inLos = true
      }
    })
  })

  return retVal
}
