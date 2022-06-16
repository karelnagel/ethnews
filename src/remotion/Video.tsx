import React, { useEffect, useState } from 'react'
import { Composition, continueRender, delayRender } from 'remotion'
import { Root } from './Root'
import { getAudioDurationInSeconds } from '@remotion/media-utils'
import { Script } from 'src/main'
import './style.css'
import { Intro } from './screens/Intro'
import { Thread } from './screens/Thread'
import { Tweet } from 'src/twitter'

export const scriptFile = process.env.REMOTION_SCRIPT_FILE ?? 'test'
export const fps = 30
export const RemotionVideo: React.FC = () => {
  const [handle] = useState(() => delayRender())
  const [durations, setDurations] = useState<number[]>([])
  const [script, setScript] = useState<Script[]>()
  const [totalDutration, setTotalDuration] = useState(1)

  useEffect(() => {
    const effect = async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const scr = require(`./videos/${scriptFile}/script.json`)
      setScript(scr)

      const durs: number[] = []
      for await (const s of scr) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const dur = await getAudioDurationInSeconds(require(`./videos/${scriptFile}/${s.position}.mp3`))
        durs.push(Number(((dur + 1) * fps).toFixed(0)))
      }
      setDurations(durs)
      setTotalDuration(durs.reduce((a, b) => a + b, 0))
      continueRender(handle)
    }
    effect()
  }, [handle])
  console.log(durations.reduce((a, b) => a + b, 0))
  return (
    <>
      <Composition
        id={`Root`}
        component={() => <Root duration={durations} script={script} />}
        durationInFrames={totalDutration}
        fps={fps}
        width={1920}
        height={1080}
      />
      <Composition id={`Intro`} component={Intro} durationInFrames={120} fps={fps} width={1920} height={1080} />
      {script && (
        <Composition
          id={`Thread`}
          component={() => <Thread thread={script[1].content.data as Tweet[]} />}
          durationInFrames={300}
          fps={fps}
          width={1920}
          height={1080}
        />
      )}
      {script && (
        <Composition
          id={`Thread2`}
          component={() => <Thread thread={script[2].content.data as Tweet[]} />}
          durationInFrames={1000}
          fps={fps}
          width={1920}
          height={1080}
        />
      )}
    </>
  )
}
