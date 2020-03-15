import { Display } from 'rot-js'
import { RenderData } from './types'
import { colorBg, renderMks, renderTerrains } from './display'

type InputMode = 'map'

// TODO: How to actually do this stuff in a smart way?
export const getUiState = (display: Display, initialData: RenderData) => {
  const uiState = {
    data: initialData,
    display: {
      value: display,
      setter: (setDisplay: Display) => {
        uiState.display.value = setDisplay
      },
    },
    renderMode: {
      value: 0,
      toggle: () => {
        uiState.renderMode.value = (uiState.renderMode.value + 1) % 2
        uiState.render()
      },
    },
    inputMode: {
      value: 'map' as InputMode,
      setter: (newValue: InputMode) => {
        uiState.inputMode.value = newValue
      },
    },
    hoverHex: {
      value: undefined as any, // TODO: Type
      listeners: [
        () => {
          if (uiState.inputMode.value === 'map') {
            const { x, y } = uiState.hoverHex.value || {}
            const hexi = uiState.data.find(
              ({ x: xx, y: yy }) => xx === x && yy === y,
            )

            document.getElementById('debug-texts').textContent = hexi
              ? JSON.stringify(hexi, undefined, 2)
              : ''
          } else if (uiState.inputMode.value === 'move') {
          }
        },
      ] as Function[],
      setWithCoords: ({ x, y }: { x: number; y: number }) => {
        uiState.hoverHex.value = uiState.data.find(
          ({ x: xx, y: yy }) => x === xx && y === yy,
        )
        uiState.hoverHex.listeners.forEach(fn => fn())
      },
    },
    chosenHex: {
      value: undefined as any,
      listeners: [
        () => {
          console.log('click', uiState.chosenHex.value)
        },
      ] as Function[],
      setWithCoords: ({ x, y }: { x: number; y: number }) => {
        uiState.chosenHex.value = uiState.data.find(
          ({ x: xx, y: yy }) => x === xx && y === yy,
        )
        uiState.chosenHex.listeners.forEach(fn => fn())
      },
    },
    render: () => {
      colorBg(display)
      if (!uiState.renderMode.value) {
        renderMks(display, uiState.data)
      } else {
        renderTerrains(display, uiState.data)
      }
    },
  }

  uiState.render()

  return uiState
}

export type UIState = ReturnType<typeof getUiState>