// TODO: This state is still written in a wrong way of thinking, getting UIMapData really shouldn't be part of reducer

import set from 'lodash/fp/set'
import { endTurn, initGameForPlayer, newGame } from './engine'
import { findHex } from './helpers/hex'
import { Game } from './model/game'
import { Hex } from './model/hex'
import { OrderType } from './model/order'
import { UIMapData, UIOrder, UIPlayerData } from './ui/types'

// NOTE: All stuff below should be easily exported to redux
export const getInitialState = () => ({
  playerIndex: 0,
  game: undefined as Game | undefined,
  renderData: {} as { mapData: UIMapData; playerData: UIPlayerData },
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

export const actionsWithDispatch = (dispatch: (action: GameAction) => any) => {
  const withDispatch = (type: GameAction['type']) => () =>
    dispatch({
      type,
    })
  const withDispatchAndData = <T = any>(type: GameAction['type']) => (
    props: T,
  ) =>
    dispatch({
      type,
      payload: props,
    })

  return {
    // TODO: Would be really nice if debugs were nested in 'debug'
    debugToggleChosenTribe: withDispatch(actionTypes.DEBUG_TOGGLE_CHOSEN_TRIBE),
    newGame: withDispatch(actionTypes.UI_NEW_GAME),
    endTurn: withDispatch(actionTypes.UI_END_TURN),
    addOrder: withDispatchAndData<{ uiOrder: UIOrder; orderData: any }>(
      actionTypes.UI_ADD_ORDER,
    ),
  }
}

const playerAmt = 4

const getNextIndex = (i: number, arr: any[]) => (i + 1) % arr.length

const refreshRenderData = (state: State) => {
  if (!state.game) {
    console.error('No game initialised!')
    return state
  }

  const currentPlayer = state.game.players[state.playerIndex]
  const mapData = initGameForPlayer(currentPlayer.tribe, state.game)
  Object.values(currentPlayer.currentOrders).forEach(({ target, type }) => {
    const { x: ox, y: oy } = target as Hex
    mapData.find(({ x, y }) => x === ox && y === oy).order = {
      type,
    }
  })

  const playerData = { leaders: currentPlayer.tribe.leaders }

  return {
    ...state,
    renderData: {
      mapData,
      playerData,
    },
  } as State
}

// const getOrderKey = ({ type, x, y }: UIOrder) => [type, x, y].join('-')

// :D
type PayloadOf<
  T extends keyof ReturnType<typeof actionsWithDispatch>
> = Parameters<ReturnType<typeof actionsWithDispatch>[T]>[0]

export const reducer = (state: State, { type, payload }: GameAction) => {
  console.info('Processing game action', type, payload)
  const currentPlayer = state.game?.players?.[state.playerIndex]
  const handler = {
    [actionTypes.DEBUG_TOGGLE_CHOSEN_TRIBE]: () => ({
      ...state,
      playerIndex: getNextIndex(state.playerIndex, state.game.players),
    }),
    [actionTypes.UI_NEW_GAME]: () => ({
      ...state,
      game: newGame(Array(playerAmt).fill('Bob')),
    }),
    [actionTypes.UI_END_TURN]: () => ({ ...state, game: endTurn(state.game) }),
    [actionTypes.UI_ADD_ORDER]: () => {
      // TODO: Prevent multiple similar orders
      const { uiOrder } = payload as PayloadOf<'addOrder'> // orderData
      const { x, y, type } = uiOrder
      const hex = findHex(state.game.map.hexes, { x, y })
      //   const key = getOrderKey(payload.uiOrder)
      //   if (state.player.currentOrders.some(o => [key]) {
      //     return
      //   }
      const newOrders = currentPlayer.currentOrders.concat({
        type: type as OrderType,
        owner: currentPlayer.tribe,
        issuer: 'Bob',
        target: hex,
        payload: payload.orderData,
      })

      return set(
        ['game', 'players', state.playerIndex, 'currentOrders'],
        newOrders,
      )(state)
    },
  } as Record<GameAction['type'], () => State>

  if (!handler[type]) {
    throw Error('Unknown action type')
  }

  const newState = handler[type]()
  return refreshRenderData(newState)
}
