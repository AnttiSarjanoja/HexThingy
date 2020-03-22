import { endTurn, initGameForPlayer, newGame } from './engine'
import { findHex } from './helpers/hex'
import { Game } from './model/game'
import { Hex } from './model/hex'
import { OrderType } from './model/order'
import { Player } from './model/player'
import { RenderData, UIOrder } from './ui/types'

// NOTE: All stuff below should be easily exported to redux
export const getInitialState = () => ({
  player: undefined as Player | undefined,
  game: undefined as Game | undefined,
  renderData: undefined as RenderData | undefined,
})

type State = ReturnType<typeof getInitialState>

const actionTypes = {
  DEBUG_TOGGLE_CHOSEN_TRIBE: 'debug-toggle-chosen-tribe',
  UI_NEW_GAME: 'ui-new-game',
  UI_END_TURN: 'ui-end-turn',
  UI_ADD_ORDER: 'ui-add-order',
} as const

type GameAction = {
  type: typeof actionTypes[keyof typeof actionTypes]
  payload?: Record<string, any>
}

export const actionsWithDispatch = (dispatch: (action: GameAction) => any) => ({
  debug: {
    toggleChosenTribe: () =>
      dispatch({
        type: actionTypes.DEBUG_TOGGLE_CHOSEN_TRIBE,
      }),
  },
  newGame: () =>
    dispatch({
      type: actionTypes.UI_NEW_GAME,
    }),
  endTurn: () =>
    dispatch({
      type: actionTypes.UI_END_TURN,
    }),
  addOrder: (uiOrder: UIOrder, orderData: any) =>
    dispatch({
      type: actionTypes.UI_ADD_ORDER,
      payload: {
        uiOrder,
        orderData,
      },
    }),
})

const playerAmt = 4

const getNextValue = <T>(value: T, arr: T[]): T =>
  arr[(arr.indexOf(value) + 1) % arr.length]

const refreshRenderData = (state: State) => {
  if (!state.player || !state.game) {
    console.error('No game or player initialised!')
    return state
  }

  const renderData = initGameForPlayer(state.player.tribe, state.game)
  Object.values(state.player.currentOrders).forEach(({ target, type }) => {
    const { x: ox, y: oy } = target as Hex
    renderData.find(({ x, y }) => x === ox && y === oy).order = {
      type,
    }
  })

  return {
    ...state,
    renderData,
  }
}

// const getOrderKey = ({ type, x, y }: UIOrder) => [type, x, y].join('-')

// TODO: Make this unmutating
export const reducer = (state: State, { type, payload }: GameAction) => {
  console.info('Processing game action', type)
  const handler = {
    [actionTypes.DEBUG_TOGGLE_CHOSEN_TRIBE]: () => {
      state.player = getNextValue(state.player, state.game.players)
      return state
    },
    [actionTypes.UI_NEW_GAME]: () => {
      const game = newGame(Array(playerAmt).fill('Bob'))
      state.player = game.players[0]
      return { ...state, game }
    },
    [actionTypes.UI_END_TURN]: () => {
      endTurn(state.game)
      return state
    },
    [actionTypes.UI_ADD_ORDER]: () => {
      // TODO: Prevent multiple similar orders
      const { x, y, type } = payload.uiOrder as UIOrder
      const hex = findHex(state.game.map.hexes, { x, y })
      //   const key = getOrderKey(payload.uiOrder)
      //   if (state.player.currentOrders.some(o =>  [key]) {
      //     return
      //   }
      state.player.currentOrders.push({
        type: type as OrderType,
        owner: state.player.tribe,
        issuer: 'Bob',
        target: hex,
        payload: payload.orderData,
      })

      console.debug('Added order', state.player.currentOrders)
      return state
    },
  } as Record<GameAction['type'], () => State>

  if (!handler[type]) {
    throw Error('Unknown action type')
  }

  const newState = handler[type]()
  return refreshRenderData(newState)
}
