import React from 'react'
import { AbsoluteFill, Audio, Sequence } from 'remotion'
import { Script } from 'src/main'
import { Tweet } from 'src/twitter'

export const Intro: React.FC<{
  duration: number[]
  script?: Script[]
  file: string
}> = ({ duration, script, file }) => {
  return (
    <>
      {script &&
        script.map((s, i) => (
          <Sequence
            from={duration.slice(0, s.position).reduce((a, b) => a + b, 0)}
            durationInFrames={duration[s.position]}
          >
            <AbsoluteFill style={{ backgroundColor: 'white', flexDirection: 'column', display: 'flex' }}>
              <h1>{s.type}</h1>
              <h1>{s.text}</h1>
              {s.content.type === 'thread' &&
                (s.content?.data as Tweet[]).map(c => (
                  <h2>
                    {c.name}: {c.text}
                  </h2>
                ))}
              <Audio key={i} src={require(`./videos/${file}/${s.position}.mp3`)} endAt={duration[s.position]} />
            </AbsoluteFill>
          </Sequence>
        ))}
    </>
  )
}
