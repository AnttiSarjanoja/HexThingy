import { initGameForPlayer, newGame, addOrders, endTurn } from './engine'
import { init } from './ui'
import { findHex } from './helpers/hex'
import { Order } from './model/game'
import { Hex } from './model/hex'

const playerAmt = 4

const game = newGame(Array(playerAmt).fill('Bob'))

let chosenTribe = 0

// TODO: gahh, rename
const togglers = {} as Record<string, Function>

let renderData = initGameForPlayer(game.players[chosenTribe].tribe, game)
const { refreshData } = init(renderData, togglers)

const addedOrders = {} as Record<string, Order>
const getOrderKey = ({ type, x, y }: UIOrder) => [type, x, y].join('-')

togglers.toggleChosenTribe = () => {
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

type UIOrder = {
  type: string
  x: number
  y: number
}

togglers.endTurn = () => {
  addOrders(game, Object.values(addedOrders))
  Object.keys(addedOrders).forEach(s => delete addedOrders[s]) // Meh
  endTurn(game)

  renderData = initGameForPlayer(game.players[chosenTribe].tribe, game)
  refreshData(renderData)
}

togglers.addOrder = (uiOrder: UIOrder, payload: any) => {
  const { x, y, type } = uiOrder
  const hex = findHex(game.map.hexes, { x, y })
  const key = getOrderKey(uiOrder)
  if (addedOrders[key]) {
    return
  }
  addedOrders[key] = {
    type,
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
