const Router = require('@koa/router')
const ossClient = require('./ossClient')

const client = ossClient()

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
