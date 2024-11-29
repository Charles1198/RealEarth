const Router = require('@koa/router')
const controller = require('../controllers/earth.js')

const router = new Router({ prefix: '/earth' })

router.get('/latestTime', controller.getEarthLatestTime)
router.get('/images', controller.getEarthTimeLine)

module.exports = router