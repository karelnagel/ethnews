import React from 'react'

export const Intro: React.FC<{
  duration: number
}> = ({}) => {
  return (
    <div className="flex items-center h-full w-full justify-center">
      <h1 className="text-9xl font-bold  text-secondary!">ETH News</h1>
    </div>
  )
}
