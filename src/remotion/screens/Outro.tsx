import React from 'react'
import { AbsoluteFill } from 'remotion'

export const Outro: React.FC = () => {
  return (
    <>
      <AbsoluteFill className="flex flex-col w-full h-full justify-center items-center">
        <h1 className="text-9xl font-bold text-primary">See you tomorrow!</h1>
      </AbsoluteFill>
    </>
  )
}
