// NOTE: Do not import anything outside ui

import React, { useEffect, useMemo, useReducer } from 'react'
import DebugText from './debug-texts'
import { DisplayWrapper } from './display'
// TODO: Supported for now, mb for later use too
// import { createDisplay } from './display/rot-js'
import { createDisplay } from './display/pixi-js'
import { handleKeyDown, removeKeyDown } from './input-keys'
import { reducer, actionsWithDispatch, getUiState, UIContext } from './ui-state'
import { GameActions, RenderData } from './types'

type Props = {
  data: RenderData
  actions: GameActions
}

const UI = ({ data, actions }: Props) => {
  const [uiState, dispatch] = useReducer(reducer, getUiState(actions))
  const uiActions = actionsWithDispatch(dispatch)

  const display = useMemo(
    () =>
      createDisplay({
        data,
        onMouseClick: uiActions.hexClick,
        onMouseMove: uiActions.hexHover,
      }),
    [],
  )

  useEffect(() => {
    uiState.display = display
    const listener = handleKeyDown(actions, uiActions)
    return () => {
      removeKeyDown(listener)
    }
  }, [])

  useEffect(() => {
    uiActions.updateRenderData(data)
  }, [data])

  useEffect(() => {
    while (uiState.gameActionsQueue.length) {
      const action = uiState.gameActionsQueue.pop()
      action()
    }
  }, [uiState.gameActionsQueue.length])

  return (
    <UIContext.Provider value={uiState}>
      <DisplayWrapper canvas={display.getCanvas()} />
      <DebugText />
    </UIContext.Provider>
  )
}

export default UI
