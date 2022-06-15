import React, { useEffect, useState } from 'react'
import { interpolate, useCurrentFrame } from 'remotion'
import { Script } from 'src/main'

export const Subtitle: React.FC = () => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, 30], [0, 1])
  const file = process.env.REMOTION_SCRIPT_FILE ?? 'videos/test/script.json'
  const [json, setJson] = useState<Script[]>()
  useEffect(() => {
    const idk = require(`./../${file}`)
    setJson(idk)
  })
  return (
    <div
      style={{
        fontFamily: 'Helvetica, Arial',
        fontSize: 40,
        textAlign: 'center',
        position: 'absolute',
        bottom: 140,
        width: '100%',
        opacity,
      }}
    >
      {json && json[0].text}
    </div>
  )
}
