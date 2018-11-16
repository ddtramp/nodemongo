// const http = require('http')
const spdy = require('spdy')
const Koa2 = require('koa2')
const path = require('path')
const fs = require('fs')

const bodyparser = require('koa-bodyparser')
const Router = require('koa-router')

const rest = require('./lib/rest')
const controller = require('./lib/controller')
const template = require('./lib/templating')
const Acl = require('./lib/ACL')
const validator = require('./lib/parameter')

// const Http2Puser = require('./lib/http2-pusher') // pusher
const Logger = require('./lib/logger') // logger
const { logger } = Logger
const DB = require('./lib/db')

const apiRouter = new Router()
const viewRouter = new Router()

const options = {
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem')
}
// Mogodb driver is async
// db must be register before use router
!(async () => {
  const db = await DB.initDb()
  const app = new Koa2()
  const isProduction = process.env.NODE_ENV === 'production'

  const acllogger = { // this is acl logger
    debug: (msg) => {
      logger.info(`* ACL DBEUG: ${msg} *`)
    }
  }

  const mongoBackend = new Acl.mongodbBackend(db, 'acl_') // eslint-disable-line
  const acl = new Acl(mongoBackend, acllogger)

  // koa2 error handler, view and api should be separated
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      // TODO record error to logger
      ctx.type = 'application/json'
      ctx.status = err.statusCode || err.status || 500
      ctx.body = {
        message: err.message
      }
    }
  })

  app.use(async (ctx, next) => {
    ctx.acl = acl
    ctx.db = db
    ctx.logger = logger
    ctx.validator = validator // only api use this
    await next()
  })

  app.use(async (ctx, next) => {
    ctx.logger.info(`Process ${ctx.request.method} ${ctx.request.url}...`)
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

  app.use(template(path.join(__dirname, '/templates'), {
    globals: [] // https://github.com/pugjs/pug/issues/2141
  }))

  app.use(rest.restify())

  controller.addControllers(apiRouter)
  controller.addViewControllers(viewRouter)

  app.use(apiRouter.routes())
  app.use(viewRouter.routes())

  const server = spdy.createServer(options, app.callback())

  const boot = () => {
    server.listen(443, () => {
      // logger.info(`Server is running at ${process.env.PORT}`)
      logger.info(`Server is running at ${443}`)
    })
  }

  process.on('uncaughtException', (error) => {
    logger.error('uncaughtException: ' + error)
  })

  if (require.main === module) {
    boot()
  } else {
    // for testing
    console.log('Running app as a module')
    module.exports = {
      boot,
      shutdown: () => {
        server.close(process.exit)
      },
      port: 443
    }
  }
})()

