/**
 * https: //www.npmjs.com/package/jsonwebtoken
 * TODO could be update usage https: //gist.github.com/ziluvatar/a3feb505c4c0ec37059054537b38fc48
 */

const JWT = require('jsonwebtoken')
const config = require('./../config')
const Store = require('./Store')
const redis = new Store()
const APIError = require('./../lib/rest').APIError

const middleware = async (ctx, next) => {
  let exclude = [
    '/api/signin',
    '/rpc/status'
  ]
  if (exclude.includes(ctx.path)) {
    return next()
  }
  if (ctx.headers && ctx.headers['auth-token'] && ctx.headers['auth-token'].split(' ')[0] === 'JWT') {
    let token = ctx.headers['auth-token'].split(' ')[1].trim()
    // verify the token twice
    let decode = JWT.verify(token, config.jwt.secret)
    let session = await redis.get(decode.user._id)

    if (session) {
      ctx.session = session
      await next()
    } else {
      ctx.logger.info('Api Request Token Expired.')
      throw new APIError(401, {
        name: 'Unauthorized',
        message: 'Session Expired'
      }) // Session Expired
    }
  } else {
    ctx.logger.info('Api Request Not Authorize, No auth-token In The Request Header.')
    throw new APIError(401, {
      name: 'Unauthorized',
      message: 'Not Authorize, No auth-token'
    }) // Not Authorize
  }
}

module.exports = {
  JWT,
  middleware
}
