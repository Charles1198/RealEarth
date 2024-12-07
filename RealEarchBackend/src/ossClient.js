const OSS = require('ali-oss')

module.exports = function () {
  return new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_REAL_EARTH_KEY_ID,
    accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_REAL_EARTH_KEY_SECRET,
    authorizationV4: true,
    // 存储空间名称。
    bucket: 'real-earth'
  })
}