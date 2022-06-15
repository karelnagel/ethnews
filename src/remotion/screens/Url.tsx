import React from 'react'

export const Url: React.FC<{
  duration: number
  url: string
}> = ({ url }) => {
  return (
    <>
      <p>{url}</p>
    </>
  )
}
