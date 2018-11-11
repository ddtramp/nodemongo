const access = async (ctx, next) => {
  // TODO view auth
  let isAllow = false
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
