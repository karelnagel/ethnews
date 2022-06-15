#!/usr/bin/env node
import 'dotenv/config'
import { introduction, outro, summarizeThread } from './openai/index.js'
import { getThreads, Tweet } from './twitter/index.js'
import { start } from './render.js'
import { writeJson } from './file/index.js'
import { toSpeech } from './google/index.js'

export interface Script {
  type: 'introduction' | 'thread' | 'ad' | 'outro'
  text: string
  position: number
  content: {
    type: 'thread' | 'introduction' | 'url' | 'outro'
    data: string | Tweet[] | null
  }
}
export default async function main() {
  const folder = new Date().toISOString()
  const folderPath = `src/remotion/videos/${folder}`
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  // Getting threads from yesterday
  const threads = await getThreads('#ethnews from:KarelETH', 2, yesterday.toISOString())
  if (!threads) {
    console.log('No threads found')
    return
  }

  // Summarizing threads
  const summaries: string[] = []
  for await (const thread of threads) {
    const response = await summarizeThread(thread)
    summaries.push(response)
  }
  const intro = await introduction(summaries)
  const out = await outro(intro, summaries)

  const script: Script[] = []
  script.push({
    type: 'introduction',
    text: intro,
    position: 0,
    content: {
      type: 'introduction',
      data: null,
    },
  })

  threads.forEach((thread, index) => {
    script.push({
      type: 'thread',
      text: summaries[index],
      position: index + 1,
      content: {
        type: 'thread',
        data: thread,
      },
    })
  })
  script.push({
    type: 'ad',
    text: 'Support us on Patreon',
    position: threads.length + 1,
    content: {
      type: 'url',
      data: 'https://www.patreon.com/karel',
    },
  })
  script.push({
    type: 'outro',
    text: out,
    position: threads.length + 2,
    content: {
      type: 'outro',
      data: null,
    },
  })
  const scriptPath = await writeJson(script, folderPath)
  console.log(`Script written to ${scriptPath}`)

  for await (const scriptItem of script) {
    await toSpeech(scriptItem.text, `${folderPath}/${scriptItem.position}.mp3`)
  }
  // Creating video with remotion
  // const scriptPath = `videos/2022-06-15/script.json`
  const videoPath = await start(folder, folderPath)
  console.log(`Video created: ${videoPath}`)
}
main()
