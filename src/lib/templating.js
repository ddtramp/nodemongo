const path = require('path')
const pug = require('pug')

function createEnv (path, opts) {
  let filename = opts.filename || 'pug'
  let doctype = opts.doctype || 'html'
  let basedir = path
  let pretty = opts.pretty || false
  let filters = opts.filters || {}
  let self = opts.self || false
  let debug = opts.debug || false
  let compileDebug = opts.compileDebug || false
  let globals = opts.globals || []
  let cache = opts.cache || false
  let inlineRuntimeFunctions = opts.inlineRuntimeFunctions || false
  let name = opts.name || 'template'
  let env = {
    filename,
    doctype,
    basedir,
    pretty,
    filters,
    self,
    debug,
    compileDebug,
    globals,
    cache,
    inlineRuntimeFunctions,
    name
  }
  return env
}

function templating (pathDir, opts) {
  var env = createEnv(pathDir, opts)
  return async (ctx, next) => {
    ctx.render = function (view, model = {}) {
      let globalsData = { state: ctx.state || {}, ...model }
      let fn = pug.compileFile(path.join(pathDir, '/', view), env)
      ctx.response.body = fn(globalsData)
      ctx.response.type = 'text/html'
    }
    await next()
  }
}

module.exports = templating
