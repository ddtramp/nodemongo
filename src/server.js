const http = require('http')
const Koa2 = require('koa2')
const path = require('path')

const bodyparser = require('koa-bodyparser')
const router = require('koa-router')()
const session = require('koa-session2')

const rest = require('./lib/rest')
const controller = require('./lib/controller')
const template = require('./lib/templating')
const Store = require('./lib/Store.js')

const Logger = require('./lib/logger') // logger

const DB = require('./lib/db')

// Mogodb driver is async
// db must be register before use router
DB.init((db) => {
  const app = new Koa2()

  const isProduction = process.env.NODE_ENV === 'production'

  let cors = require('koa2-cors')

  app.use(cors({
    origin: function (ctx) {
      // return '*'
      // if (ctx.url === '/test') {
      //     return '*' // 允许来自所有域名请求
      // }
      return ctx.request.header.origin
      // return 'http://localhost:8080' // 这样就能只允许 http://localhost:8080 这个域名的请求了
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'x-auth-token', 'access-auth-token'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-auth-token', 'access-auth-token']
  }))

  app.use(async (ctx, next) => {
    ctx.db = db
    ctx.logger = Logger.logger
    await next()
  })
  // session
  app.use(session({
    key: 'sessionId',
    store: new Store()
  }))

  // app.use((async (ctx, next) => {
  //   ctx.db = db
  //   await next()
  // }))
  // log request URL
  app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
    let start = new Date().getTime()
    let execTime
    await next()
    execTime = new Date().getTime() - start
    ctx.response.set('X-Response-Time', `${execTime}ms`)
  })

  // static file support:
  if (!isProduction) {
    let staticFiles = require('./lib/static-files')
    app.use(staticFiles('/static/', path.join(__dirname, '/static')))
  }

  app.use(bodyparser())

  app.use(template(path.join(__dirname, '/views'), {
    globals: [{
      title: 'test pug'
    }]
  }))

  app.use(rest.restify())

  controller.addControllers(router)
  app.use(router.routes())

  // let server = app.listen(process.env.PORT, ())
  let server = http.createServer(app.callback()).listen(process.env.PORT, () => { // eslint-disable-line
    console.log(`Server is running at ${process.env.PORT}`)
  })
})
