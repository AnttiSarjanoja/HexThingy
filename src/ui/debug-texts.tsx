import React, { useContext } from 'react'
import { UIContext } from './ui-state'

const DebugText = () => {
  const { debug } = useContext(UIContext)

  return (
    <div id={'debug-texts'} style={{ whiteSpace: 'pre' }}>
      {debug.hoverHex}
    </div>
  )
}

export default DebugText
