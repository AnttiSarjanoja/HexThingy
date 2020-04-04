import React, { useEffect, useMemo, useReducer } from 'react'
import ReactDOM from 'react-dom'
import { actionsWithDispatch, getInitialState, reducer } from './game-state'
import UI from './ui'

const uiConfig = {
  displayType: 'pixi' as const,
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, getInitialState())
  const actions = useMemo(() => actionsWithDispatch(dispatch), [dispatch])

  useEffect(() => {
    actions.newGame()
  }, [])

  if (!state.renderData.mapData) {
    return <>Loading</>
  }

  return (
    <UI
      actions={actions}
      config={uiConfig}
      mapData={state.renderData.mapData}
      playerData={state.renderData.playerData}
    />
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
