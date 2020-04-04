// NOTE: Do not import anything outside ui

import React, { useEffect, useMemo, useReducer } from 'react'
import DebugText from './debug-texts'
import { DisplayWrapper } from './display'
import { createDisplay as createPixiDisplay } from './display/pixi-js'
import { createDisplay as createRotDisplay } from './display/rot-js' // NOTE: Supported for now, mb for later use too
import { handleKeyDown, removeKeyDown } from './input-keys'
import Leaders from './leaders'
import { GameActions, UIMapData, UIPlayerData } from './types'
import { actionsWithDispatch, getUiState, reducer, UIContext } from './ui-state'

type Props = {
  playerData: UIPlayerData
  mapData: UIMapData
  actions: GameActions
  config: {
    displayType: 'rot' | 'pixi'
  }
}

const UI = ({ actions, config, mapData, playerData }: Props) => {
  const [uiState, dispatch] = useReducer(
    reducer,
    getUiState(actions, playerData),
  )
  const uiActions = actionsWithDispatch(dispatch)

  const display = useMemo(
    () =>
      (config.displayType === 'rot' ? createRotDisplay : createPixiDisplay)({
        data: mapData,
        onMouseClick: uiActions.hexClick,
        onMouseMove: uiActions.hexHover,
      }),
    [config],
  )

  useEffect(() => {
    uiState.display = display
    const listener = handleKeyDown(actions, uiActions)
    return () => {
      removeKeyDown(listener)
    }
  }, [])

  useEffect(() => {
    uiActions.updateRenderData(mapData)
  }, [mapData])

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
      <Leaders uiActions={uiActions} />
    </UIContext.Provider>
  )
}

export default UI
