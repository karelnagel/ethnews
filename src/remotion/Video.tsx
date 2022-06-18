import React from 'react'
import { AbsoluteFill, Audio, Sequence } from 'remotion'
import { Script, Tweet } from 'src/interfaces'
import { Intro } from './screens/Intro'
import { Outro } from './screens/Outro'
import { Thread } from './screens/Thread'
import { Url } from './screens/Url'

export const Video: React.FC<{
  duration: number[]
  script: Script[]
  audioFiles: string[]
}> = ({ duration, script, audioFiles }) => {
  return (
    <>
      {script.map((s, i) => (
        <Sequence
          from={duration.slice(0, s.position).reduce((a, b) => a + b, 0)}
          durationInFrames={duration[s.position]}
        >
          <AbsoluteFill className="bg-white ">
            {s.content.type === 'thread' && <Thread thread={s.content.data as Tweet[]} />}
            {s.content.type === 'url' && <Url url={s.content.data as string} />}
            {s.content.type === 'intro' && <Intro />}
            {s.content.type === 'outro' && <Outro />}

            {audioFiles[s.position] && <Audio key={i} src={audioFiles[s.position]} endAt={duration[s.position]} />}
          </AbsoluteFill>
        </Sequence>
      ))}
    </>
  )
}
