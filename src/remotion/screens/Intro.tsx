import React from 'react'
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { fps } from '../Root'
import image from './../images/intro.jpeg'

export const Intro: React.FC = () => {
  const frame = useCurrentFrame()
  const scale = spring({
    fps,
    frame,
    config: {
      mass: 10,
    },
  })
  const { height, width } = useVideoConfig()
  const opacity = interpolate(frame, [20, 40], [0, 1])
  return (
    <AbsoluteFill className="flex flex-col justify-center items-center space-y-16">
      <AbsoluteFill>
        <Img src={image} height={height} width={width} />
      </AbsoluteFill>
      <h1 className="text-9xl font-bold  text-primary" style={{ transform: `scale(${scale})` }}>
        ETH News
      </h1>
      <h3 className="text-4xl font-bold  z-20" style={{ opacity }}>
        The most important tweets in Ethereum today
      </h3>
    </AbsoluteFill>
  )
}
