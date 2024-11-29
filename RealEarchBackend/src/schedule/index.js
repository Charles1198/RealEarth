const cron = require('node-cron')
const fs = require('fs')
const path = require('path')
const { saveFile } = require('../common/fileUtil')
const axios = require('axios')

cron.schedule('0,10,20,30,40,50 * * * *', scheduledTask)

setTimeout(() => {
  scheduledTask()
}, 1000)

async function scheduledTask() {
  // 组装当前图片链接和名称。因为原始图片10分钟刷新一次，现在的肯定没有，所以获取10分钟之前的图片
  let imageInfo = setupCurEarthImageInfo(10)
  let res = await downloadImage(imageInfo.imageUrl)
  if (!res) {
    // 如果没获取到就再取20分钟前的
    imageInfo = setupCurEarthImageInfo(20)
    res = await downloadImage(imageInfo.imageUrl)
    if (!res) {
      // 还没获取到那就算了，下次再获取
      return
    }
  }

  // 保存图片
  const rootDirPath = process.cwd()
  const imagePath = path.join(rootDirPath, 'public', 'earth', imageInfo.imageName)
  await saveFile(res, imagePath)

  // 再保存一份，图片名固定为'earth_latest.png'
  const latestImagePath = path.join(rootDirPath, 'public', 'earth_latest.png')
  await saveFile(res, latestImagePath)

  // 清理旧的图片
  cleanUpOldPictures()
}

function setupCurEarthImageInfo(minusMinutes) {
  const date = new Date()
  let curMinute = date.getUTCMinutes()
  curMinute = curMinute - curMinute % 10
  date.setUTCMinutes(curMinute - minusMinutes)
  let year = date.getUTCFullYear()
  let month = date.getUTCMonth()
  let day = date.getUTCDate()
  let hour = date.getUTCHours()
  let minute = date.getUTCMinutes()
  year = `${year}`
  month = month < 10 ? `0${month}` : `${month}`
  day = day < 10 ? `0${day}` : `${day}`
  hour = hour < 10 ? `0${hour}` : `${hour}`
  minute = minute < 10 ? `0${minute}` : `${minute}`
  return {
    imageUrl: `https://himawari8-dl.nict.go.jp/himawari8/img/D531106/1d/550/${year}/${month}/${day}/${hour}${minute}00_0_0.png`,
    imageName: `${year}_${month}_${day}_${hour}_${minute}.png`
  }
}

async function downloadImage(url) {
  return new Promise((resolve) => {
    axios({ method: 'get', url, responseType: 'arraybuffer' }).then(res => {
      if (res.status === 200) {
        const imageData = Buffer.from(res.data)
        const imageSize = imageData.length
        if (imageSize < 1024 * 5) {
          resolve(null)
        } else {
          resolve(imageData)
        }
      } else {
        resolve(null)
      }
    }).catch(err => {
      resolve(null)
    })
  })
}

/**
 * 清理旧图片
 *
 * 只保留144张，也就是过去24小时内的图片
 */
function cleanUpOldPictures() {
  const rootDirPath = process.cwd()
  const earthImagesPath = path.join(rootDirPath, 'public', 'earth')

  const files = fs.readdirSync(earthImagesPath)
  if (files.length === 0) {
    return
  }

  files.sort().reverse()
  files.forEach((file, i) => {
    if (i >= 144) {
      fs.unlinkSync(path.join(earthImagesPath, file))
    }
  })
}