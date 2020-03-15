import { getMap } from '../helpers/map'
import { Game, Order } from '../model/game'
import { getRenderData } from './fov'
import { Tribe } from '../model/map'
import { findHex } from '../helpers/hex'
import { Hex } from '../model/hex'

// TODO: Insert other data?
export const newGame = (users: string[]): Game => {
  const map = getMap(users.length) // TODO: should maybe return map AND players

  return {
    map,
    players: users.map((u, i) => ({ name: u, tribe: map.tribes[i] })),
    turns: [{ orders: [] }],
  }
}

export const initGameForPlayer = (tribe: Tribe, game: Game) =>
  getRenderData(tribe, game.map)

export const addOrders = (game: Game, addedOrders: Order[]) => {
  game.turns[game.turns.length - 1].orders.push(...addedOrders)
}

// TODO: Validate turns
export const endTurn = ({ map, turns }: Game) => {
  console.log('processing orders', turns[turns.length - 1])
  turns[turns.length - 1].orders.forEach(o => {
    // TODO: Handling different types
    const from = o.payload.from
    const fromHex = findHex(map.hexes, { x: from.x, y: from.y })
    const clan = fromHex.clan
    fromHex.clan = undefined

    const to = o.target as Hex
    const toHex = findHex(map.hexes, { x: to.x, y: to.y })
    toHex.clan = clan
    console.log(from, to)
  })
  turns.push({ orders: [] })
}
