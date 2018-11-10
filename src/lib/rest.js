const logger = require('./logger').logger
module.exports = {
  APIError: function (code, message) {
    this.code = code || 'internal:unknown_error'
    this.message = message || ''

    Error.captureStackTrace(this, this.constructor)
    this.constructor.prototype = Error.prototype
  },
  restify: (pathPrefix) => {
    pathPrefix = pathPrefix || '/api/'
    return async (ctx, next) => {
      if (ctx.request.path.startsWith(pathPrefix)) {
        logger.info(`Process API ${ctx.request.method} ${ctx.request.url}...`)
        ctx.rest = (data) => {
          ctx.body = data
          ctx.type = 'application/json'
        }
        try {
          await next()
        } catch (e) {
          logger.error('Process API error...')
          ctx.response.status = 400
          ctx.response.type = 'application/json'
          ctx.response.body = {
            code: e.code || 'internal:unknown_error',
            message: e.message || ''
          }
        }
      } else {
        await next()
      }
    }
  }
}
