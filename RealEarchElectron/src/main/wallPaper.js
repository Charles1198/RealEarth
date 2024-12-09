import { app } from 'electron'
import fs from 'fs'
import http from 'http'
import cron from 'node-cron'
import path from 'path'
import { addPaddingForImage } from './imageTool'

export async function changeWallpaperRealTime() {
  cron.schedule('1,11,21,31,41,51 * * * *', changeWallpaper)
  await changeWallpaper()
}

export async function changeWallpaper() {
  const latestEarthImagePath = await downloadImage(
    'http://real-earth.oss-cn-beijing.aliyuncs.com/latest/latest.png'
  )
  if (!latestEarthImagePath) {
    console.log('unable to download earth image')
    return
  }

  const { outputPath, err } = await addPaddingForImage(latestEarthImagePath)
  if (err) {
    console.log(err)
    return
  }
  try {
    const { setWallpaper } = await import('wallpaper')
    await setWallpaper(outputPath)
    console.log('Wallpaper has been set!')
  } catch (e) {
    console.log(e)
  }
}

async function downloadImage(url) {
  return new Promise((resolve) => {
    http
      .get(url, async (res) => {
        if (res.statusCode === 200) {
          const imageSavePath = await saveImage(res, 'latestEarthImage.png')
          resolve(imageSavePath)
        } else {
          resolve(null)
        }
      })
      .on('error', () => {
        resolve(null)
      })
  })
}

function saveImage(res, imageName) {
  const dirPath = app.getPath('appData')
  const imageDirPath = path.join(dirPath, 'real-earth', 'image')
  if (!fs.existsSync(imageDirPath)) {
    fs.mkdirSync(imageDirPath)
  }

  const imagePath = path.join(imageDirPath, imageName)
  return new Promise((resolve) => {
    const curImageFile = fs.createWriteStream(imagePath)
    res
      .pipe(curImageFile)
      .on('finish', () => {
        resolve(imagePath)
      })
      .on('error', () => {
        resolve(null)
      })
  })
}
