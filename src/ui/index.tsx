import React, { useEffect, useMemo } from 'react'
import DebugText from './debug-texts'
import { DisplayWrapper, newDisplay } from './display'
import {
  handleDisplayMouseClick,
  handleDisplayMouseMove,
  handleKeyDown,
} from './input'
import { getUiState } from './state'
import { GameActions, RenderData } from './types'

type Props = {
  data: RenderData
  actions: GameActions
}

const UI = ({ data, actions }: Props) => {
  const display = useMemo(() => newDisplay(data), [])
  const uiState = useMemo(() => getUiState(display, data), [])

  useEffect(() => {
    handleKeyDown(uiState, actions)
    handleDisplayMouseMove(uiState)
    handleDisplayMouseClick(uiState, actions)
    // TODO: Remove on unmount
  }, [])

  useEffect(() => {
    // TODO: Just ugly
    uiState.data = data
    uiState.render()
  }, [data])

  return (
    <>
      <DisplayWrapper display={display} />
      <DebugText>-</DebugText>
    </>
  )
}

export default UI
