module.exports = {
  'GET /': async (ctx, next) => {
    let session = ctx.session
    let user = {}
    if (session.remember) {
      user = session.user
    }
    if (ctx.session.user) {
      ctx.render('index/index.pug', {
        user,
        title: 'index page'
      })
    } else {
      ctx.response.redirect('/login.html')
    }
  },
  'GET /login.html': async (ctx, next) => {
    ctx.render('login/login.pug', { hi: 'hi pug', title: 'login' })
  }
}
