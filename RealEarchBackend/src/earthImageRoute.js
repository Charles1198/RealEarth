const Router = require('@koa/router')
const OSS = require('ali-oss')

const client = new OSS({
  region: 'oss-cn-beijing',
  // 从环境变量中获取AccessKey ID的值
  accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
  // 从环境变量中获取AccessKey Secret的值
  accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET,
  authorizationV4: true,
  // 存储空间名称。
  bucket: 'real-earth'
})

const router = new Router({ prefix: '/earth' })

router.get('/past24hour', async (ctx) => {
  const result = await client.listV2({ 'max-keys': 200, prefix: 'past24hour/' })

  if (!result) {
    ctx.body = failedResp(500, 'no result')
    return
  }

  const { res, objects } = result

  if (res.statusCode === 200) {
    ctx.body = successResp(objects.reverse())
  } else {
    ctx.body = failedResp(res.statusCode, res.statusMessage)
  }
})

function successResp(data, message) {
  return {
    code: 200,
    data,
    message: message || '',
  }
}

function failedResp(code, message) {
  return { code, message }
}

module.exports = router

// module.exports = function (app) {
//   app.use(router).use(router.allowedMethods())
// }
