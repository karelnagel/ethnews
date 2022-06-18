import { exec } from 'child_process'
import config from './conf.js'

export const start = async (file: string, folder: string): Promise<string> => {
  const filePath = `${folder}/video.mp4`

  return new Promise((resolve, reject) => {
    exec(
      `REMOTION_SCRIPT_FILE=${file} npx remotion render src/remotion/index.tsx ${config.composition} ${filePath}`,
      async function (err, stdout, stderr) {
        console.log(stdout)
        console.log(stderr)
        if (err) {
          reject(err)
        }
        resolve(filePath)
      },
    )
  })
}
