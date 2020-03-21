import { addOrders, endTurn, initGameForPlayer, newGame } from './engine'
import { findHex } from './helpers/hex'
import { Hex } from './model/hex'
import { Order, OrderType } from './model/order'
import { init } from './ui'
import { GameActions, UIOrder } from './ui/types'
import { getRandomColor } from './helpers/color'
import { RNG } from 'rot-js'

const playerAmt = 4

const game = newGame(Array(playerAmt).fill('Bob'))

let chosenTribe = 0

const actions = { debug: {} } as GameActions

let renderData = initGameForPlayer(game.players[chosenTribe].tribe, game)
const { refreshData } = init(renderData, actions)

// NOTE: This variable is stored only in client instances and initialised when loaded
const addedOrders = {} as Record<string, Order>
const getOrderKey = ({ type, x, y }: UIOrder) => [type, x, y].join('-')

actions.debug.toggleChosenTribe = () => {
  chosenTribe = (chosenTribe + 1) % game.map.tribes.length
  renderData = initGameForPlayer(game.players[chosenTribe].tribe, game)
  Object.values(addedOrders).forEach(({ target, type }) => {
    const { x: ox, y: oy } = target as Hex
    renderData.find(({ x, y }) => x === ox && y === oy).order = {
      type,
    }
  })
  refreshData(renderData)
}

actions.endTurn = () => {
  addOrders(game, Object.values(addedOrders))
  Object.keys(addedOrders).forEach(s => delete addedOrders[s]) // Meh
  endTurn(game)

  renderData = initGameForPlayer(game.players[chosenTribe].tribe, game)
  refreshData(renderData)
}

actions.addOrder = (uiOrder: UIOrder, payload: any) => {
  const { x, y, type } = uiOrder
  const hex = findHex(game.map.hexes, { x, y })
  const key = getOrderKey(uiOrder)
  if (addedOrders[key]) {
    return
  }
  addedOrders[key] = {
    type: type as OrderType,
    owner: game.players[chosenTribe].tribe,
    issuer: 'Bob',
    target: hex,
    payload,
  }
  Object.values(addedOrders).forEach(({ target, type }) => {
    const { x: ox, y: oy } = target as Hex
    renderData.find(({ x, y }) => x === ox && y === oy).order = {
      type,
    }
  })
  refreshData(renderData)

  console.log('Added order', uiOrder, payload)

  // const currentTurn = game.turns[game.turns.length - 1] // TODO: This is handled when combining everything
  // currentTurn.orders
}
