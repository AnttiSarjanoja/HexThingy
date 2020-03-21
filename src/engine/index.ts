import { findHex } from '../helpers/hex'
import { getMap } from '../helpers/map'
import { Game } from '../model/game'
import { Hex } from '../model/hex'
import { Tribe } from '../model/map'
import { Order } from '../model/order'
import { getRenderData } from './fov'
import { messages } from './messages'

// TODO: Insert other data?
export const newGame = (users: string[]): Game => {
  const map = getMap(users.length) // TODO: should maybe return map AND players

  return {
    map,
    players: users.map((u, i) => ({
      name: u,
      tribe: map.tribes[i],
      messages: [],
    })),
    turns: [{ orders: [] }],
  }
}

export const initGameForPlayer = (tribe: Tribe, game: Game) =>
  getRenderData(tribe, game.map)

export const addOrders = (game: Game, addedOrders: Order[]) => {
  game.turns[game.turns.length - 1].orders.push(...addedOrders)
}

// TODO: Validate turns
export const endTurn = ({ map, turns, players }: Game) => {
  const currentTurn = turns[turns.length - 1]
  console.debug('processing orders', currentTurn)
  currentTurn.orders.forEach(o => {
    // TODO: Handling different types
    const from = o.payload.from
    const fromHex = findHex(map.hexes, { x: from.x, y: from.y })
    const clan = fromHex.clan
    fromHex.clan = undefined

    const to = o.target as Hex
    const toHex = findHex(map.hexes, { x: to.x, y: to.y })
    toHex.clan = clan

    const owner = players.find(p => p.tribe === o.owner)
    owner.messages.push(
      messages.debug.orders[o.type](owner, clan, fromHex, toHex),
    )
  })
  turns.push({ orders: [] })
}
