import { exec } from 'child_process'

export const start = async (file: string, folder: string): Promise<string> => {
  const filePath = `${folder}/video.mp4`

  return new Promise((resolve, reject) => {
    exec(
      `REMOTION_SCRIPT_FILE=${file} npx remotion render src/remotion/index.tsx Root ${filePath}`,
      async function (err) {
        if (err) {
          reject(err)
        }
        resolve(filePath)
      },
    )
  })
}
