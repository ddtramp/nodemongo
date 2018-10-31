// index:
const crypt = require('./../../lib/crypto')

module.exports = {
  'POST /web/login': async (ctx, next) => {
    ctx.session = {}
    const user = {
      email: 'wangxichao001@gmail.com',
      password: 'abs122825619',
      name: 'jackwang'
    }
    try {
      let body = ctx.request.body
      let email = body.email.trim()
      let password = body.password.trim()
      let remember = body.remember

      if (email && password) {
        if (crypt.sha1(email).toString() === crypt.sha1(user.email).toString()) {
          if (crypt.sha1(password).toString() === crypt.sha1(user.password).toString()) {
            ctx.response.body = {
              status: 200,
              data: user,
              message: 'success'
            }
            ctx.session.user = user
            ctx.session.remember = remember
            ctx.cookies.set('remenber', remember)
          } else {
            ctx.response.body = {
              status: 420,
              data: null,
              message: 'Wrong Email or Password'
            }
          }
        } else {
          ctx.response.body = {
            status: 420,
            data: null,
            message: 'No Email'
          }
        }
      } else {
        ctx.response.body = {
          status: 420,
          data: null,
          message: 'No Email and Password'
        }
      }
      ctx.response.type = 'application/json'
      await next()
    } catch (e) {
      ctx.throw(400, 'Bad Parameters', e)
      await next()
    }
  },
  'GET /web/exit': async (ctx, next) => {
    try {
      ctx.session = {}
      ctx.response.body = {
        status: 200,
        data: null,
        message: 'success'
      }

      ctx.cookies.set('remenber', null)
    } catch (e) {
      ctx.throw(400, 'Server internal error')
    }
  }
}
