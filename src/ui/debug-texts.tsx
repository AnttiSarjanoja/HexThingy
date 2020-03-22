import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const DebugText = ({ children }: Props) => (
  <div id={'debug-texts'} style={{ whiteSpace: 'pre' }}>
    {children}
  </div>
)

export default DebugText
