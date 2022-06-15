import React, { useEffect, useState } from 'react'
import { Composition, continueRender, delayRender } from 'remotion'
import { All } from './All'
import { getAudioDurationInSeconds } from '@remotion/media-utils'
import { Script } from 'src/main'
import './style.css'

export const RemotionVideo: React.FC = () => {
  const file = process.env.REMOTION_SCRIPT_FILE ?? 'test'
  const fps = 30
  const [handle] = useState(() => delayRender())
  const [duration, setDuration] = useState<number[]>([])
  const [script, setScript] = useState<Script[]>()
  const [totalDutration, setTotalDuration] = useState(1)

  useEffect(() => {
    const effect = async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const scr = require(`./videos/${file}/script.json`)
      setScript(scr)

      const durs: number[] = []
      for await (const s of scr) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const dur = await getAudioDurationInSeconds(require(`./videos/${file}/${s.position}.mp3`))
        durs.push(Number((dur * fps).toFixed(0)))
      }
      setDuration(durs)
      setTotalDuration(durs.reduce((a, b) => a + b, 0))
      continueRender(handle)
    }
    effect()
  }, [handle])
  console.log(duration.reduce((a, b) => a + b, 0))
  return (
    <>
      <Composition
        id={`All`}
        component={() => <All duration={duration} script={script} file={file} />}
        durationInFrames={totalDutration}
        fps={fps}
        width={1920}
        height={1080}
      />
    </>
  )
}
