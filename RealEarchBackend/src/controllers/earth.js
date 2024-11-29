const path = require('path')
const fs = require('fs')
const { successResp, failedResp, RESP_CODE_FAILED_NORMAL } = require('./httpResp')

async function getEarthLatestTime(ctx) {
  const rootDirPath = process.cwd()
  const earthImagesPath = path.join(rootDirPath, 'public', 'earth')

  const files = fs.readdirSync(earthImagesPath)
  if (files.length === 0) {
    ctx.body = failedResp(RESP_CODE_FAILED_NORMAL, '未找到可用图片')
    return
  }

  files.sort().reverse()
  const latestImageName = files[0]
  const [year, month, day, hour, minute] = latestImageName.split('.')[0].split('_')
  const latestTime = `${year}-${month}-${day} ${hour}:${minute}:00`

  ctx.body = successResp(latestTime)
}

async function getEarthTimeLine(ctx) {
  const rootDirPath = process.cwd()
  const earthImagesPath = path.join(rootDirPath, 'public', 'earth')

  const files = fs.readdirSync(earthImagesPath)
  if (files.length === 0) {
    ctx.body = failedResp(RESP_CODE_FAILED_NORMAL, [])
    return
  }

  files.sort().reverse()
  ctx.body = successResp(files)
}

module.exports = { getEarthLatestTime, getEarthTimeLine }