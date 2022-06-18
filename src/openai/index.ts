import { Configuration, OpenAIApi } from 'openai'
import { Script, Tweet } from 'src/interfaces'

import config from './../conf.js'

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }),
)

const mainContext = 'You are the news reporter for EthNews, which is a news outlet for Ethereum news.'

export async function createScript(threads: Tweet[][]): Promise<Script[]> {
  const summaries = await summarizeThreads(threads)
  console.log('Threads summarized')

  const intro = await introduction(summaries)
  console.log('Intro created')

  const out = await outro(intro, summaries)
  console.log('Outro created')

  const script: Script[] = []
  script.push({
    type: 'intro',
    text: intro,
    position: 0,
    content: {
      type: 'intro',
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
    type: 'outro',
    text: out,
    position: threads.length + 1,
    content: {
      type: 'outro',
      data: null,
    },
  })
  return script
}
export async function summarizeThreads(threads: Tweet[][]): Promise<string[]> {
  const summaries: string[] = []
  const context = `${mainContext} You have to summarize the previous Twitter thread for a video transcript.`
  for await (const thread of threads) {
    const formattedThread = thread
      .map(tweet => `${tweet.name} (${tweet.username}): ${tweet.text.replace('\n', ' ')}`)
      .join('\n')
    summaries.push(await gpt3(`${formattedThread} \n\n ${context}`))
  }
  return summaries
}

export async function introduction(content: string[]): Promise<string> {
  const context = `${mainContext} You have to write short(10-20 words) greeting for and the previous content. Today is ${new Date().toUTCString()}`
  const introduction = await gpt3(`${content.join('\n')} \n\n ${context} `)
  return introduction
}

export async function outro(intro: string, content: string[]): Promise<string> {
  const context = `${mainContext} The previous content is your today's topic, you have to write a short ending to the story (10-20 words).`
  const introduction = await gpt3(`${intro} \n ${content.join('\n')} \n\n ${context}`)
  return introduction
}

export async function gpt3(
  prompt: string,
  temperature = config.gpt.temperature,
  max_tokens = config.gpt.max_tokens,
  top_p = config.gpt.top_p,
  frequency_penalty = config.gpt.frequency_penalty,
  presence_penalty = config.gpt.presence_penalty,
  model = config.gpt.model,
) {
  try {
    const response = await openai.createCompletion({
      model,
      prompt,
      temperature,
      max_tokens,
      top_p,
      frequency_penalty,
      presence_penalty,
    })
    if (response.data.choices) {
      return response.data.choices[0].text ?? ''
    }
  } catch (e) {
    console.log(e)
  }
  return ''
}
