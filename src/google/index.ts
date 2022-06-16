// Imports the Google Cloud client library
import textToSpeech from '@google-cloud/text-to-speech'

// Import other required libraries
import fs from 'fs'
import util from 'util'
// Creates a client
const client = new textToSpeech.TextToSpeechClient()

export async function toSpeech(text: string, output: string) {
  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech({
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: 'en-US', ssmlGender: 'FEMALE', name: 'en-US-Wavenet-F' },
    // select the type of audio encoding
    audioConfig: { audioEncoding: 'MP3', pitch: -1.6 },
  })
  // Write the binary audio content to a local file

  if (response.audioContent) {
    const writeFile = util.promisify(fs.writeFile)
    await writeFile(output, response.audioContent, 'binary')
    console.log('Audio content written to file: output.mp3')
  } else {
    console.log('eror')
  }
}
