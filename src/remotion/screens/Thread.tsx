import React from 'react'
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { Tweet } from 'src/twitter'
import { fps } from '../Video'

export const Thread: React.FC<{
  thread: Tweet[]
}> = ({ thread }) => {
  const frame = useCurrentFrame()

  const { durationInFrames } = useVideoConfig()
  const oneDuration = durationInFrames / thread.length

  return (
    <AbsoluteFill className="w-full h-full max-w-screen-sm m-auto" style={{ transform: 'translateY(30%)' }}>
      <div
        className="flex flex-col space-y-6 "
        style={{
          transform: `translateY(${-(frame / durationInFrames) * 100}%)`,
          // transform: `translateY(-${(frame / durationInFrames) * 100 - 25}%)`,
        }}
      >
        {thread &&
          thread.map((tweet, i) => (
            <div
              className="bg-white shadow-lg px-4 py-4 duration-1000 flex items-start space-x-4"
              style={{
                transform: `scale(${oneDuration * i <= frame && oneDuration * (i + 1) > frame ? 1.2 : 1})`,
                transitionDuration: `${(oneDuration / fps) * 1000}ms`,
              }}
            >
              <Img src={tweet.image} className="rounded-full h-16" />
              <div className="text-lg">
                <div className="flex space-x-3 text-xl">
                  <p className="font-bold  text-xl">{tweet.name}</p>
                  <p>@{tweet.username}</p>
                </div>
                <h3 className="">{tweet.text}</h3>
              </div>
            </div>
          ))}
      </div>
    </AbsoluteFill>
  )
}
