import React, { useEffect, useRef } from 'react'

type Props = {
  canvas: HTMLElement
}

export const DisplayWrapper = ({ canvas }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    wrapperRef.current?.appendChild(canvas)
    return () => wrapperRef.current?.removeChild(canvas)
  }, [])

  return <div ref={wrapperRef} />
}
