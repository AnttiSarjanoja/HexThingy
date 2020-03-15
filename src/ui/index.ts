import { newDisplay } from './display'
import {
  handleDisplayMouseClick,
  handleDisplayMouseMove,
  handleKeyDown,
} from './input'
import { getUiState } from './state'
import { RenderData } from './types'

// TODO: Separate dom changes
export const init = (
  data: RenderData,
  togglers: Record<string, Function>, // TODO: doesn't feel right
) => {
  const display = newDisplay(data)
  const uiState = getUiState(display, data)

  document.getElementById('root').appendChild(display.getContainer())
  const divi = document.createElement('div')
  divi.style.whiteSpace = 'pre'
  divi.id = 'debug-texts'
  document.getElementById('root').appendChild(divi)

  handleKeyDown(uiState, togglers)
  handleDisplayMouseMove(uiState)
  handleDisplayMouseClick(uiState, togglers)
  // display.getContainer().onmousemove = handleDisplayMouseMove(uiState)

  return {
    refreshData: (data: RenderData) => {
      uiState.data = data
      uiState.render()
    },
  }
}
