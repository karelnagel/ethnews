import React from 'react'
import { AbsoluteFill, Audio, Sequence } from 'remotion'
import { Script } from 'src/main'
import { Tweet } from 'src/twitter'
import { Intro } from './screens/Intro'
import { Outro } from './screens/Outro'
import { Thread } from './screens/Thread'
import { Url } from './screens/Url'
import { scriptFile } from './Video'

export const Root: React.FC<{
  duration: number[]
  script?: Script[]
}> = ({ duration, script }) => {
  return (
    <>
      {script &&
        script.map((s, i) => (
          <Sequence
            from={duration.slice(0, s.position).reduce((a, b) => a + b, 0)}
            durationInFrames={duration[s.position]}
          >
            <AbsoluteFill className="bg-white ">
              {s.content.type === 'thread' && <Thread thread={s.content.data as Tweet[]} />}
              {s.content.type === 'url' && <Url url={s.content.data as string} />}
              {s.content.type === 'intro' && <Intro />}
              {s.content.type === 'outro' && <Outro />}

              <Audio key={i} src={require(`./videos/${scriptFile}/${s.position}.mp3`)} endAt={duration[s.position]} />
            </AbsoluteFill>
          </Sequence>
        ))}
    </>
  )
}
