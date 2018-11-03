const fs = require('fs')
const zlib = require('zlib')
const path = require('path')

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

    ctx.render('login/login.pug', { hi: 'hi pug', title: 'login' })
  }
}
