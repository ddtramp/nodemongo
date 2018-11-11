/**
 * Access - Control - Allow - Origin
 * https://www.npmjs.com/package/koa2-cors
 */
const Koa2cors = require('koa2-cors')

const cors = Koa2cors({
  origin: function (ctx) {
    // return '*'
    // if (ctx.url === '/test') {
    //     return '*' // 允许来自所有域名请求
    // }
    return ctx.request.header.origin
    // return 'http://localhost:8080' // 这样就能只允许 http://localhost:8080 这个域名的请求了
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'x-auth-token'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-auth-token']
})

module.exports = cors
