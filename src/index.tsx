import React, { useEffect, useMemo, useReducer } from 'react'
import ReactDOM from 'react-dom'
import { actionsWithDispatch, getInitialState, reducer } from './game-state'
import UI from './ui'

const App = () => {
  const [state, dispatch] = useReducer(reducer, getInitialState())
  const actions = useMemo(() => actionsWithDispatch(dispatch), [dispatch])

  useEffect(() => {
    actions.newGame()
  }, [])

  if (!state.renderData) {
    return <>Loading</>
  }

  return <UI data={state.renderData} actions={actions} />
}

ReactDOM.render(<App />, document.getElementById('root'))
