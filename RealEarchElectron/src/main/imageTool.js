import { screen } from 'electron'
import sharp from 'sharp'

export async function addPaddingForImage(inputPath) {
  const outputPath = getOutputPath(inputPath)

  const { width: targetWidth, height: targetHeight } = getImageOutputSize()

  try {
    // 定义原始图片宽高，正常情况下是正方形
    let imageWidth
    let imageHeight

    // 需要将图片尺寸调整到屏幕短边的0.7倍大小
    if (targetWidth > targetHeight) {
      imageWidth = imageHeight = Math.round(targetHeight * 0.7)
    } else {
      imageWidth = imageHeight = Math.round(targetWidth * 0.7)
    }

    // 创建一个黑色背景，宽高为 targetWidth, targetHeight
    const background = sharp({
      create: {
        width: targetWidth,
        height: targetHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      }
    })

    // 将原始图片嵌入到背景中，居中放置
    const overlay = await sharp(inputPath)
      .resize(imageWidth, imageHeight)
      .toFormat('png')
      .png({ quality: 100 })
      .toBuffer()

    const xOffset = Math.round((targetWidth - imageWidth) / 2)
    const yOffset = Math.round((targetHeight - imageHeight) / 2)
    await background.composite([{ input: overlay, top: yOffset, left: xOffset }]).toFile(outputPath)
    return { outputPath: outputPath, err: '' }
  } catch (e) {
    return { outputPath: '', err: e.message }
  }
}

function getImageOutputSize() {
  const displays = screen.getAllDisplays()

  let screenMaxWidth = displays[0].size.width
  let screenMaxHeight = displays[0].size.height

  if (displays.length > 1) {
    // 有好几块屏幕，那么找出屏幕最大的，简单来说就是最宽的
    for (let i = 1; i < displays.length; i++) {
      if (displays[i].size.width > screenMaxWidth) {
        screenMaxWidth = displays[i].size.width
        screenMaxHeight = displays[i].size.height
      }
    }
  }

  return { width: screenMaxWidth, height: screenMaxHeight }
}

function getOutputPath(inputPath) {
  const arr = inputPath.split('.')
  return `${arr[0]}Wallpaper.${arr[1]}`
}
