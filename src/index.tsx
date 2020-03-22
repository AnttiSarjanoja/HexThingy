import { reducer, actionsWithDispatch, getInitialState } from './engine-wrapper'
import UI from './ui'
import ReactDOM from 'react-dom'
import React, { useReducer, useEffect } from 'react'

const App = () => {
  const [state, dispatch] = useReducer(reducer, getInitialState())
  const actions = actionsWithDispatch(dispatch)

  useEffect(() => {
    actions.newGame()
  }, [])

  if (!state.renderData) {
    return <>Loading</>
  }

  return (
    <>
      <UI data={state.renderData} actions={actions} />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
