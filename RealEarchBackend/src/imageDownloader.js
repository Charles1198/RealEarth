const cron = require('node-cron')
const axios = require('axios')
const OSS = require('ali-oss')

class ImageDownloader {
  constructor() {
    this._client = new OSS({
      region: 'oss-cn-beijing',
      // 从环境变量中获取AccessKey ID的值
      accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
      // 从环境变量中获取AccessKey Secret的值
      accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET,
      authorizationV4: true,
      // 存储空间名称。
      bucket: 'real-earth'
    })
  }

  start() {
    cron.schedule('0,10,20,30,40,50 * * * *', async () => {
      await this._scheduledTask()
    })
    // this._scheduledTask()
  }

  async _scheduledTask() {
    // 组装当前图片链接和名称。因为原始图片10分钟刷新一次，现在的肯定没有，所以获取10分钟之前的图片
    let imageInfo = this._setupCurEarthImageInfo(10)
    let res = await this._downloadImage(imageInfo.imageUrl)
    if (!res) {
      // 如果没获取到就再取20分钟前的
      imageInfo = this._setupCurEarthImageInfo(20)
      res = await this._downloadImage(imageInfo.imageUrl)
      if (!res) {
        // 还没获取到那就算了，下次再获取
        return
      }
    }

    await this._saveImageToOss(res, 'past24hour/' + imageInfo.imageName)
    await this._saveImageToOss(res, 'latest/latest.png')

    await this._removeExpiredImagesInOss()
  }

  _setupCurEarthImageInfo(minusMinutes) {
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

  _downloadImage(url) {
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

  async _saveImageToOss(file, fileName) {
    await this._client.put(fileName, file)
  }

  async _removeExpiredImagesInOss() {
    const result = await this._client.listV2({ 'max-keys': 200, prefix: 'past24hour/' })

    if (!result) {
      return
    }

    const { res, objects } = result

    if (res.statusCode !== 200) {
      return
    }

    let imageList = objects.map((item) => item.name)
    if (imageList.length <= 144) {
      return
    }

    imageList = imageList.sort().reverse().splice(144)
    try {
      await this._client.deleteMulti(imageList, { quiet: true })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = ImageDownloader