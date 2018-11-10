const APIError = require('./../../lib/rest').APIError
const Store = require('./../../lib/Store')
const JWT = require('jsonwebtoken')
const config = require('./../../config')

const crypt = require('./../../lib/crypto')

const store = new Store()

module.exports = {
  /**
   * sign
   * @param ctx
   * @param next
   * @returns {Promise.<void>}
   * @constructor
   */
  'POST /api/signin': async (ctx, next) => {
    try {
      let body = ctx.request.body
      let email = body.email.trim()
      let password = body.password.trim()
      let data = {
        email,
        password
      }
      let rule = {
        email: 'email',
        password: 'string',
        remember: {
          required: false,
          type: 'string'
        }
      }
      let errors = ctx.validator.validate(rule, data)
      if (!errors) {
        let user = await ctx.db.collection('users').findOne({
          email
        })
        if (!user) {
          ctx.rest({
            status: 403,
            data: null,
            message: 'Email and/or password is wrong.'
          })
        } else if (await crypt.compare(password, user.password)) {
          let session = {
            user
          }
          let token = JWT.sign(session, config.jwt.secret) // generate token

          await store.set(session, {
            sid: user._id
          }) // set token to redis
          ctx.rest({
            status: 200,
            data: Object.assign({}, user, {
              password: null,
              token // send token
            }),
            message: 'success'
          })
        } else {
          ctx.rest({
            status: 403,
            data: null,
            message: 'Email and/or password is wrong.'
          })
        }
      } else {
        throw new APIError(403, errors)
      }
    } catch (e) {
      ctx.throw(500)
    }
  },
  /**
   * SON OF A BITCH, SOMETIMES THE ASYNC/AWAIT CAUSE ERROR
   * AND NO REASON, AND Suddenly, IT'S JSUE FINE
   */
  'GET /api/users': async (ctx, next) => {
    try {
      let session = ctx.session
      let users = await ctx.db.collection('users').find({}).toArray()
      ctx.rest({
        status: 200,
        message: 'success',
        data: {
          session,
          users
        }
      })
    } catch (e) {
      ctx.logger.error(e)
      ctx.throw(500)
    }
  },
  'POST /api/users': async (ctx, next) => {
    try {
      let session = ctx.session
      let users = await ctx.db.collection('users').find({}).toArray()
      ctx.rest({
        status: 200,
        message: 'success',
        data: {
          session,
          users
        }
      })
    } catch (e) {
      ctx.logger.error(e)
      ctx.throw(500)
    }
  }
}
