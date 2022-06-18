import { exec } from 'child_process'
import config from './conf.js'

export const start = async (folder: string, folderPath: string): Promise<string> => {
  const filePath = `${folderPath}/video.mp4`

  return new Promise((resolve, reject) => {
    exec(
      `npx remotion render src/remotion/index.tsx ${config.composition} ${filePath}  --props=./videos/${folder}/script.json`,
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
