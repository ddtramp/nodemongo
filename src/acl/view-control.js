const access = async (ctx, next) => {
  // TODO view auth
  // when use koa-password module, there is something was wrong
  // just right here to get user from redis or db, u can get user id:
  // session.password.user
  let isAllow = false
  console.log('Session: ', ctx.session)
  console.log('State: ', ctx.state)
  console.log('isAuthenticated: ', ctx.isAuthenticated())
  if (ctx.session.user) {
    isAllow = await ctx.acl.isAllowed(ctx.session.user._id, ctx.path, 'get')
  } else {
    isAllow = await ctx.acl.isAllowed('guest', '/' + ctx.path.split('/')[1], 'get')
  }
  if (isAllow) {
    ctx.session.refresh() // TODO refresh session
    return next()
  } else {
    ctx.body = 'You do not have permission to access the page'
    ctx.type = 'text/html'
  }
}

module.exports = access
