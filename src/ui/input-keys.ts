import { GameActions } from './types'
import { actionsWithDispatch } from './ui-state'

type UiActions = ReturnType<typeof actionsWithDispatch>

export function handleKeyDown(gameActions: GameActions, uiActions: UiActions) {
  const handlers = {
    v: () => uiActions.changeRenderMode(),
    t: () => gameActions.debugToggleChosenTribe(),
    e: () => gameActions.endTurn(),
    m: () => uiActions.addMoveOrder(),
    ArrowRight: () => uiActions.cameraMove({ x: -50, y: 0 }),
    ArrowDown: () => uiActions.cameraMove({ x: 0, y: -50 }),
    ArrowLeft: () => uiActions.cameraMove({ x: 50, y: 0 }),
    ArrowUp: () => uiActions.cameraMove({ x: 0, y: 50 }),
    PageUp: () => uiActions.cameraRotate({ delta: -60 }),
    PageDown: () => uiActions.cameraRotate({ delta: 60 }),
    '+': () => uiActions.cameraZoom({ delta: 0.1 }),
    '-': () => uiActions.cameraZoom({ delta: -0.1 }),
    Escape: () => uiActions.cancelCurrent(),
  } as Record<string, VoidFunction>

  const listener = ({ key }: KeyboardEvent) => {
    handlers[key]?.()
  }

  document.addEventListener('keydown', listener)
  return listener
}

export const removeKeyDown = (listener: any) => {
  document.removeEventListener('keydown', listener)
}
