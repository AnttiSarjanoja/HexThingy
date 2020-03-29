import { GameActions } from './types'
import { actionsWithDispatch } from './ui-state'

type UiActions = ReturnType<typeof actionsWithDispatch>

export function handleKeyDown(gameActions: GameActions, uiActions: UiActions) {
  const handlers = {
    v: () => uiActions.changeRenderMode(),
    t: () => gameActions.debugToggleChosenTribe(),
    e: () => gameActions.endTurn(),
    m: () => uiActions.addMoveOrder(),
    Escape: () => uiActions.cancelCurrent(),
  } as Record<string, VoidFunction>

  const listener = ({ key, repeat }: KeyboardEvent) => {
    if (!repeat) {
      handlers[key]?.()
    }
  }

  document.addEventListener('keydown', listener)
  return listener
}

export const removeKeyDown = (listener: any) => {
  document.removeEventListener('keydown', listener)
}

// NOTE: Keyboard navigations
// function checkKey(e: KeyboardEvent) {
//   if (e.keyCode === 38) {
//     // up arrow
//     loc[0] = loc[0] - 2
//   } else if (e.keyCode === 40) {
//     // down arrow
//     loc[0] = loc[0] + 2
//   } else if (e.keyCode === 33) {
//     // pageup
//     loc[0] = loc[0] - 1
//     loc[1] = loc[1] - 1
//   } else if (e.keyCode === 34) {
//     // pagedown
//     loc[0] = loc[0] - 1
//     loc[1] = loc[1] + 1
//   } else if (e.keyCode === 37) {
//     // left arrow
//     loc[0] = loc[0] + 1
//     loc[1] = loc[1] - 1
//   } else if (e.keyCode === 39) {
//     // right arrow
//     loc[0] = loc[0] + 1
//     loc[1] = loc[1] + 1
//   }
// }
