/* eslint-env node */

const config = {
  lastDays: 1,
  threadsCount: 3,
  searchTerm: '#ethnews from:KarelETH',
  folderPath: 'videos',
  composition: 'Video',
  uploadDelay: 30000,
  status: 'Todays news:',
  gpt: {
    model: 'text-curie-001', // ['text-ada-001','text-curie-001','text-babbage-001','text-davinci-002'],
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
  tts: {
    lang: 'en-US',
    name: 'en-US-Wavenet-F',
    pitch: -1.6,
    speakingRate: 1,
  },
}
export default config
