module.exports = {
  'GET /': async (ctx, next) => {
    let session = ctx.session
    let user = {}
    if (session.remember) {
      user = session.user
    }
    // if (ctx.session.user) {
    ctx.render('index/index.pug', {
      user,
      token: ctx.csrf,
      title: 'index page'
    })
    // } else {
    //   ctx.response.redirect('/login.html')
    // }
  },
  'GET /index.html': async (ctx, next) => {
    ctx.redirect('/')
  },
  'GET /login.html': async (ctx, next) => {
    const http2Pusher = require('./../../lib/http2-pusher')
    http2Pusher({
      mainfestData: {
        '/static/images/logo.png': {
          weight: 1,
          type: 'img'
        }
      }
    })(ctx, next)
    // https://nodejs.org/dist/latest-v8.x/docs/api/zlib.html
    // example http2 pusher
    // let context = ctx.res.push('/static/css/sign.css', {
    //   status: 200, // optional
    //   method: 'GET', // optional
    //   request: {
    //     accept: '*/*'
    //   },
    //   response: {
    //     'content-type': 'text/css; charset=utf-8',
    //     'Content-Encoding': 'gzip'
    //   }
    // }, (_, stream) => {
    //   // logger error
    //   stream.on('error', function (error) {
    //     console.log('ctx.res.push error', error)
    //   })

    //   stream.on('close', () => {
    //     console.log('stream close')
    //   })
    //   stream.on('finish', (cleanup) => {
    //     console.log('stream finish')
    //   })

    //   fs.createReadStream(path.join(__dirname, './../../static/css/sign.css'))
    //     .pipe(zlib.createGzip())
    //     .pipe(stream)
    // })

    ctx.render('login/login.pug', {
      hi: 'hi pug',
      title: 'login',
      token: ctx.csrf
    })
  },
  'GET /register.html': async (ctx, next) => {
    const http2Pusher = require('./../../lib/http2-pusher')
    http2Pusher({
      mainfestData: {
        '/static/images/logo.png': {
          weight: 1,
          type: 'img'
        }
      }
    })(ctx, next)
    ctx.render('login/register.pug', {
      hi: 'hi pug',
      token: ctx.csrf,
      title: 'Register Page'
    })
  },
  'GET /reset.html': async (ctx, next) => {
    ctx.render('login/reset.pug', {
      hi: 'hi pug',
      token: ctx.csrf,
      title: 'Reset Page'
    })
  },
  /**
   * verify email and token
   * reset password
   */
  'GET /reset/:userId/:token': async (ctx, next) => {
    // TODO reset password
    // Store.get(token)
    // should render template
    ctx.body = {
      csrf: ctx.csrf,
      TODO: 'TODO should be validate token and userId'
    }
    ctx.type = 'application/json'
  },
  'GET /protected.html': async (ctx, next) => {
    ctx.type = 'text/html'
    ctx.status = 200
    ctx.body = 'protected page'
  },
  'GET /profile': async (ctx, next) => {
    ctx.type = 'text/html'
    ctx.status = 200
    ctx.body = 'profile page'
  },
  'GET /admin': async (ctx, next) => {
    ctx.type = 'text/html'
    ctx.status = 200
    ctx.body = 'admin page'
  },
  'GET /404.html': async (ctx, next) => {
    ctx.type = 'text/html'
    ctx.status = 200
    ctx.body = '404, not found'
  }
}
