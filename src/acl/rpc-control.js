const access = (ctx, next) => {
  // TODO rpc api auth
  console.log(ctx.session)
  console.log(ctx.path)
  return next()
}

module.exports = access
