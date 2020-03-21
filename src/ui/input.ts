import { areNeighs } from '../common/helpers'
import { UIState } from './state'
import { GameActions } from './types'

export function handleKeyDown(uiState: UIState, actions: GameActions) {
  const handlers = {
    v: () => uiState.renderMode.toggle(),
    t: () => actions.debug.toggleChosenTribe(),
    e: () => actions.endTurn(),
    m: () => {
      if (uiState.chosenHex.value?.unit?.type === 'clan') {
        uiState.inputMode.setter('move')
      }
    },
    Escape: () => uiState.inputMode.setter('map'),
  } as Record<string, VoidFunction>

  document.addEventListener('keydown', ({ key }) => handlers[key]?.())
}

export function handleDisplayMouseMove(uiState: UIState) {
  uiState.display.value.getContainer().addEventListener('mousemove', evt => {
    const [x, y] = uiState.display.value.eventToPosition(evt)
    uiState.hoverHex.setWithCoords({ x, y })
  })
}

export function handleDisplayMouseClick(
  uiState: UIState,
  actions: GameActions,
) {
  const handlers = {
    map: (x: number, y: number) => {
      uiState.chosenHex.setWithCoords({ x, y })
    },
    move: (x: number, y: number) => {
      console.log(uiState.chosenHex.value)
      const { x: fromX, y: fromY } = uiState.chosenHex.value
      const target = uiState.data.find(
        ({ x: xx, y: yy }) => x === xx && y === yy,
      )
      if (
        uiState.chosenHex.value?.unit?.type === 'clan' &&
        areNeighs({ x, y }, { x: fromX, y: fromY }) &&
        !target.units.length
      ) {
        uiState.chosenHex.unset()
        actions.addOrder(
          { type: 'move', x, y },
          {
            from: { x: fromX, y: fromY },
          },
        )
        uiState.inputMode.setter('map')
      }
    },
  }

  uiState.display.value.getContainer().addEventListener('mousedown', evt => {
    const [x, y] = uiState.display.value.eventToPosition(evt)
    handlers[uiState.inputMode.value](x, y)
  })
}

// TODO: Input modes

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
//   render()
// }
