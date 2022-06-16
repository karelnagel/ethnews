import { Configuration, OpenAIApi } from 'openai'
import { Tweet } from 'src/twitter'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const context = 'You are the news reporter for EthNews, which is a news outlet for Ethereum news.'
export async function summarizeThread(thread: Tweet[]): Promise<string> {
  const formattedThread = thread
    .map(tweet => `${tweet.name} (${tweet.username}): ${tweet.text.replace('\n', ' ')}`)
    .join('\n')
  const summary = await gpt3(
    `${formattedThread} \n\n ${context} You have to summarize the previous Twitter thread for a video transcript.`,
  )
  return summary ?? ''
}

export async function introduction(content: string[]): Promise<string> {
  const introduction = await gpt3(
    `${content.join('\n')}
    \n\n ${context} You have to write short(10-20 words) greeting for and the previous content. Today is ${new Date().toUTCString()}`,
  )
  return introduction ?? ''
}

export async function outro(intro: string, content: string[]): Promise<string> {
  const introduction = await gpt3(
    `${intro} ${content.join(
      '\n',
    )} \n\n ${context} The previous content is your today's topic, you have to write a short ending to the story (10-20 words).`,
  )
  return introduction ?? ''
}

export async function gpt3(
  prompt: string,
  temperature = 0.7,
  max_tokens = 256,
  top_p = 1,
  frequency_penalty = 0,
  presence_penalty = 0,
  model: 'text-ada-001' | 'text-davinci-002' = 'text-davinci-002',
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
      return response.data.choices[0].text ?? null
    }
  } catch (e) {
    console.log(e)
  }
  return null
}
