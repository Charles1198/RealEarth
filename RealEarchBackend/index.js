const Koa = require('koa')
const useRoute = require('./src/routes/index.js')
const koaStatic = require('koa-static')
const path = require('path')

// 定时任务
require('./src/schedule/index.js')

const app = new Koa()

useRoute(app)

// 让接口能访问静态资源
app.use(koaStatic(path.join(__dirname, 'public')))

app.listen(3000, () => {
  console.log('server is running, port is 3000')
})