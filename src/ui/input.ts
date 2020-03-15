import { UIState } from './state'

export function handleKeyDown(
  uiState: UIState,
  togglers: Record<string, VoidFunction>,
) {
  document.addEventListener('keydown', ({ key }) => {
    console.debug(key)
    if (key === 'v') {
      uiState.renderMode.toggle()
    }
    if (key === 't') {
      togglers.toggleChosenTribe()
    }
  })
}

export function handleDisplayMouseMove(uiState: UIState) {
  uiState.display.value.getContainer().addEventListener('mousemove', evt => {
    const [x, y] = uiState.display.value.eventToPosition(evt)
    uiState.hoverHex.setWithCoords({ x, y })
  })
}

export function handleDisplayMouseClick(uiState: UIState) {
  uiState.display.value.getContainer().addEventListener('mousedown', evt => {
    const [x, y] = uiState.display.value.eventToPosition(evt)
    uiState.chosenHex.setWithCoords({ x, y })
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
