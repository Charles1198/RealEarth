const earthRouter = require('./earth.js')

module.exports = function (app) {
    app.use(earthRouter.routes()).use(earthRouter.allowedMethods())
}