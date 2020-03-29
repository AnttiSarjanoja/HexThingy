import React from 'react'
import set from 'lodash/fp/set'
import { Coord } from '../common/types'
import { GameDisplay } from './display/types'
import { RenderData, GameActions } from './types'
import { areNeighs } from '../common/helpers'

type InputMode = 'map' | 'move'

const renderModes = ['regions', 'terrain'] as const
type RenderMode = typeof renderModes[number]
const getNextRenderMode = (mode: RenderMode) =>
  renderModes[(renderModes.findIndex(m => m === mode) + 1) % renderModes.length]

export const getUiState = (gameActions: GameActions) => ({
  gameActions,
  gameActionsQueue: [] as VoidFunction[],
  debug: {} as { hoverHex?: string },
  display: undefined as GameDisplay | undefined,
  data: undefined as RenderData | undefined,
  renderMode: 'regions' as RenderMode,
  inputMode: 'map' as InputMode,
  hoverHex: undefined as RenderData[0] | undefined,
  chosenHex: undefined as RenderData[0] | undefined,
})

export type UIState = ReturnType<typeof getUiState>

export const UIContext = React.createContext(getUiState(undefined))

const actionTypes = {
  UPDATE_DATA: 'update-render-data',
  CHANGE_RENDER_MODE: 'change-render-mode',
  CANCEL_CURRENT: 'cancel-current',
  ADDING_MOVE_ORDER: 'add-move-order',
  HEX_HOVER: 'hex-hover',
  HEX_CLICK: 'hex-click',
} as const

type UIAction = {
  type: typeof actionTypes[keyof typeof actionTypes]
  payload?: Record<string, any>
}

export const actionsWithDispatch = (dispatch: (action: UIAction) => any) => {
  const withDispatch = (type: UIAction['type']) => () =>
    dispatch({
      type,
    })
  const withDispatchAndData = <T = any>(type: UIAction['type']) => (props: T) =>
    dispatch({
      type,
      payload: props,
    })

  return {
    updateRenderData: withDispatchAndData<RenderData>(actionTypes.UPDATE_DATA),
    changeRenderMode: withDispatch(actionTypes.CHANGE_RENDER_MODE),
    cancelCurrent: withDispatch(actionTypes.CANCEL_CURRENT),
    addMoveOrder: withDispatch(actionTypes.ADDING_MOVE_ORDER),
    hexHover: withDispatchAndData<Coord>(actionTypes.HEX_HOVER),
    hexClick: withDispatchAndData<Coord>(actionTypes.HEX_CLICK),
  }
}

// :D
type PayloadOf<
  T extends keyof ReturnType<typeof actionsWithDispatch>
> = Parameters<ReturnType<typeof actionsWithDispatch>[T]>[0]

const render = (renderState: UIState) => {
  renderState.display?.colorBg()
  if (renderState.renderMode === 'regions') {
    renderState.display?.renderMks(renderState.data, {
      chosenHex: renderState.chosenHex,
    })
  } else if (renderState.renderMode === 'terrain') {
    renderState.display?.renderTerrains(renderState.data)
  }
  return renderState
}

export const reducer = (state: UIState, { type, payload }: UIAction) => {
  const handler = {
    [actionTypes.UPDATE_DATA]: () => {
      const data = payload as PayloadOf<'updateRenderData'>
      const retVal = { ...state, data }
      return render(retVal)
    },
    [actionTypes.ADDING_MOVE_ORDER]: () =>
      state.chosenHex ? { ...state, inputMode: 'move' } : state,
    [actionTypes.CANCEL_CURRENT]: () => ({
      ...state,
      inputMode: 'map',
      chosenHex: undefined,
    }),
    [actionTypes.CHANGE_RENDER_MODE]: () => {
      const retVal = {
        ...state,
        renderMode: getNextRenderMode(state.renderMode),
      }
      return render(retVal)
    },
    [actionTypes.HEX_HOVER]: () => {
      const { x, y } = payload as PayloadOf<'hexHover'>
      const hex = state.data.find(({ x: xx, y: yy }) => xx === x && yy === y)
      return set(
        ['debug', 'hoverHex'],
        hex ? JSON.stringify(hex, undefined, 2) : '',
      )(state)
    },
    [actionTypes.HEX_CLICK]: () => {
      const { x, y } = payload as PayloadOf<'hexClick'>
      const hex = state.data.find(({ x: xx, y: yy }) => xx === x && yy === y)
      const clickHandler = {
        map: () => ({ ...state, chosenHex: hex }),
        move: () => {
          const { x: fromX, y: fromY } = state.chosenHex
          if (
            // TODO: Enable moving warriors too
            state.chosenHex?.units.some((u: any) => u.type === 'clan') &&
            areNeighs({ x, y }, { x: fromX, y: fromY }) &&
            hex &&
            !hex.units.length
          ) {
            state.gameActionsQueue.push(() =>
              state.gameActions.addOrder({
                uiOrder: { type: 'move', x, y },
                orderData: {
                  from: { x: fromX, y: fromY },
                },
              }),
            )
            return {
              ...state,
              inputMode: 'map',
              chosenHex: undefined,
            }
          }

          return { ...state }
        },
      } as Record<InputMode, () => UIState>

      const retVal = clickHandler[state.inputMode]()
      return render(retVal)
    },
  } as Record<UIAction['type'], () => UIState>

  if (!handler[type]) {
    throw Error('Unknown action type')
  }

  const newState = handler[type]()
  return newState
}
