const Koa = require('koa')
const koaStatic = require('koa-static')
const path = require('path')
const ImageDownloader = require('./src/imageDownloader')
const router = require('./src/earthImageRoute')

const app = new Koa()

app.use(router.routes()).use(router.allowedMethods())

// 让接口能访问静态资源
app.use(koaStatic(path.join(__dirname, 'public')))

app.listen(3001, () => {
  console.log('server is running, port is 3000')

  // 定时下载图片保存到阿里云oss
  const imageDownloader = new ImageDownloader()
  imageDownloader.start()
})
