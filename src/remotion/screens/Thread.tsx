import React from 'react'
import { Tweet } from 'src/twitter'

export const Thread: React.FC<{
  duration: number
  thread: Tweet[]
}> = ({ thread }) => {
  return <>{thread && thread.map((t, i) => <p key={i}>{t.text}</p>)}</>
}
