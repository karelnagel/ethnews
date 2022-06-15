import React from 'react'
import { AbsoluteFill, Audio, Sequence } from 'remotion'
import { Script } from 'src/main'
import { Tweet } from 'src/twitter'
import { Intro } from './screens/Intro'
import { Outro } from './screens/Outro'
import { Thread } from './screens/Thread'
import { Url } from './screens/Url'

export const All: React.FC<{
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
            <AbsoluteFill className="bg-white ">
              {s.content.type === 'thread' && (
                <Thread thread={s.content.data as Tweet[]} duration={duration[s.position]} />
              )}
              {s.content.type === 'url' && <Url url={s.content.data as string} duration={duration[s.position]} />}
              {s.content.type === 'intro' && <Intro duration={duration[s.position]} />}
              {s.content.type === 'outro' && <Outro duration={duration[s.position]} />}

              <Audio key={i} src={require(`./videos/${file}/${s.position}.mp3`)} endAt={duration[s.position]} />
            </AbsoluteFill>
          </Sequence>
        ))}
    </>
  )
}
