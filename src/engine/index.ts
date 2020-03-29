import { RNG } from 'rot-js'
import { findHex } from '../helpers/hex'
import { getMap } from '../helpers/map'
import { Game } from '../model/game'
import { Hex } from '../model/hex'
import { Tribe } from '../model/map'
import { Order } from '../model/order'
import { getRenderData } from './fov'
import { messages } from './messages'

// TODO: Insert other data? Map config?
export const newGame = (users: string[]): Game => {
  const map = getMap(users.length) // TODO: should maybe return map AND players
  const rngState = RNG.getState()

  return {
    map,
    players: users.map((u, i) => ({
      name: u,
      tribe: map.tribes[i],
      messages: [],
      currentOrders: [],
    })),
    turns: [{ orders: [], rngState }],
  }
}

export const initGameForPlayer = (tribe: Tribe, game: Game) =>
  getRenderData(tribe, game.map)

export const addOrders = (game: Game, addedOrders: Order[]) => {
  game.turns[game.turns.length - 1].orders.push(...addedOrders)
}

// TODO: Validate turns
// TODO: Unmutate
export const endTurn = (game: Game): Game => {
  const { map, turns, players } = game
  const currentTurn = turns[turns.length - 1]

  players.forEach(p => {
    currentTurn.orders.push(...p.currentOrders)
    p.currentOrders = []
  })

  console.debug('processing orders', players, currentTurn)

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
  const rngState = RNG.getState()
  turns.push({ orders: [], rngState })

  return game
}
