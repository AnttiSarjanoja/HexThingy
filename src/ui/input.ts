import { UIState } from './state'
import { areNeighs } from '../common/helpers'

export function handleKeyDown(
  uiState: UIState,
  togglers: Record<string, Function>,
) {
  document.addEventListener('keydown', ({ key }) => {
    console.debug(key)
    if (key === 'v') {
      uiState.renderMode.toggle()
    } else if (key === 't') {
      togglers.toggleChosenTribe()
    } else if (key === 'e') {
      togglers.endTurn()
    } else if (key === 'm') {
      if (uiState.chosenHex.value?.unit?.type === 'clan') {
        uiState.inputMode.setter('move')
      }
    } else if (key === 'Escape') {
      uiState.inputMode.setter('map')
    }
  })
}

export function handleDisplayMouseMove(uiState: UIState) {
  uiState.display.value.getContainer().addEventListener('mousemove', evt => {
    const [x, y] = uiState.display.value.eventToPosition(evt)
    uiState.hoverHex.setWithCoords({ x, y })
  })
}

export function handleDisplayMouseClick(
  uiState: UIState,
  togglers: Record<string, Function>,
) {
  uiState.display.value.getContainer().addEventListener('mousedown', evt => {
    const [x, y] = uiState.display.value.eventToPosition(evt)
    // TODO: just no
    const _ = {
      map: () => {
        uiState.chosenHex.setWithCoords({ x, y })
      },
      move: () => {
        console.log(uiState.chosenHex.value)
        const { x: fromX, y: fromY } = uiState.chosenHex.value
        const target = uiState.data.find(
          ({ x: xx, y: yy }) => x === xx && y === yy,
        )
        if (
          uiState.chosenHex.value?.unit?.type === 'clan' &&
          areNeighs({ x, y }, { x: fromX, y: fromY }) &&
          !target.unit
        ) {
          uiState.chosenHex.unset()
          togglers.addOrder(
            { type: 'clan-move', x, y },
            {
              from: { x: fromX, y: fromY },
            },
          )
          uiState.inputMode.setter('map')
        }
      },
    }[uiState.inputMode.value]()
  })
}

// TODO: Input modes
// e: End turn

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
