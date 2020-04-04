import { FOV } from 'rot-js'
import { Tribe, GameMap } from '../model/map'
import { allowsLos, findHex } from '../helpers/hex'
import { getClanHex } from '../helpers/clan'
import { LOSDIST } from '../constants'
import { Region } from '../model/region'
import { Hex } from '../model/hex'
import { UIMapData } from '../ui/types'
import terrainData from '../../data/terrain.json'

// prettier-ignore
const getUnits = ({ beast, clan, warriors }: Pick<Hex, 'beast' | 'clan' | 'warriors'>) => [
  beast ? { type: 'beast', char: 'B', textColor: '#000', name: beast.name } : undefined,
  clan  ? { type: 'clan', char: 'C', textColor: '#fff', name: clan.name } : undefined,
  ...(warriors?.map(w => ({ type: 'warrior', char: 'W', textColor: '#fff', name: w.name })) || []),
].filter(Boolean)

// TODO: Where to move these get-renderables, model?
const getRenderableHex = (
  { x, y, terrain, resource, beast, clan, warriors }: Hex,
  region?: Region,
): UIMapData[0] => ({
  regionName: region?.name,
  regionColor: region?.color,
  ...{ x, y },
  terrain: {
    type: terrain,
    color: (terrainData as any)[terrain].color,
    char: (terrainData as any)[terrain].char,
    resource: resource
      ? {
          name: resource.name,
          type: resource.type,
          char: resource.char,
        }
      : undefined,
  },
  inLos: false,
  units: getUnits({ beast, clan, warriors }),
})

export const getRenderData = (
  currentTribe: Tribe,
  { regions, hexes }: GameMap,
): UIMapData => {
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
  const retVal = [] as UIMapData
  hexes.forEach(h =>
    retVal.push(
      getRenderableHex(
        h,
        regions.find(r => r.hexes.some(hh => hh === h)),
      ),
    ),
  )

  fovHexes.forEach(({ x, y }) => {
    fovi.compute(x, y, LOSDIST, (xx, yy, _r, _vis) => {
      const hex = findHex(hexes, { x: xx, y: yy })
      if (hex) {
        retVal.find(val => val.x === xx && val.y === yy).inLos = true
      }
    })
  })

  return retVal
}
