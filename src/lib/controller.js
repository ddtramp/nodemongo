const fs = require('fs')
const path = require('path')
const logger = require('./logger').logger

const cors = require('./koa2Cors')

const viewControl = require('./../acl/view-control')
const apiControl = require('./../acl/api-control')

const csrfMiddleware = require('./csrf')
const session = require('./session')

const jwtModule = require('./jwt').middleware

/**
 * add router from map
 * @param {*} router Router
 * @param {*} mapping { key: 'value' }
 * @param {*} [argvs=[fn]] async (ctx, next) => (next())
 */
function addMapping (router, mapping, argvs = []) {
  for (var url in mapping) {
    if (url.startsWith('GET ')) {
      var path = url.substring(4)
      router.get(path, ...argvs, mapping[url])
      logger.info(`register URL mapping: GET ${path}`)
    } else if (url.startsWith('POST ')) {
      let path = url.substring(5)
      router.post(path, ...argvs, mapping[url])
      logger.info(`register URL mapping: POST ${path}`)
    } else if (url.startsWith('PUT ')) {
      let path = url.substring(4)
      router.put(path, ...argvs, mapping[url])
      logger.info(`register URL mapping: PUT ${path}`)
    } else if (url.startsWith('DELETE ')) {
      let path = url.substring(7)
      router.del(path, ...argvs, mapping[url])
      logger.info(`register URL mapping: DELETE ${path}`)
    } else {
      logger.error(`invalid URL: ${url}`)
    }
  }
}

function addControllers (router) {
  let argvsTop = []
  let folderDir = path.join(__dirname, './../controllers')
  let dirs = fs.readdirSync(folderDir)

  dirs.forEach((folderName, index, list) => {
    let folderChildren = path.join(folderDir, '/', folderName)
    var files = fs.readdirSync(folderChildren)
    var jsFiles = files.filter((f) => {
      return f.endsWith('.js')
    }, files)
    let argvs = [...argvsTop]
    // TODO acl
    if (folderName === 'web') {
      argvs.push(session)
      // TODO should be cmoment, only for form submit
      // AJAX calls use JavaScript and are CORS-restricted.
      // There is no way for a simple <form> to send JSON,
      // so by accepting only JSON, you eliminate the possibility of the above form
      // https://github.com/pillarjs/understanding-csrf
      argvs.push(csrfMiddleware)
    } else {
      argvs.push(cors)
      argvs.push(jwtModule) // verify token and set session
      argvs.push(apiControl) // TODO acl control
    }

    for (var f of jsFiles) {
      logger.info(`process controller: ${f}...`)
      let mapping = require(path.join(folderChildren, '/', f))
      addMapping(router, mapping, argvs)
    }
  })
}
/**
 * VIEWS REQUEST ONLY SUPPORT GET
 * @param {*} router
 * @param {*} mapping
 */
function addViewMapping (router, mapping, glolbalPusher, childrenPusher) {
  for (var url in mapping) {
    if (url.startsWith('GET ')) {
      var path = url.substring(4)
      router.get(path, glolbalPusher, childrenPusher, mapping[url])
      logger.info(`register URL mapping: GET ${path}`)
    } else {
      logger.error(`invalid URL: ${url}`)
    }
  }
}

const addViewControllers = (router) => {
  // view session
  router.use(session)

  router.use(csrfMiddleware)

  router.use(viewControl)

  let folderDir = path.join(__dirname, './../views')
  let dirs = fs.readdirSync(folderDir)
  let filterDirs = dirs.filter((f) => {
    return !f.endsWith('.json')
  }, dirs)

  let glolbalPusher = async (ctx, next) => { next() }
  let mainfest = {}
  if (dirs.includes('mainfest.json')) {
    mainfest = require(path.join(folderDir, '/mainfest.json'))
    glolbalPusher = require('./http2-pusher')({
      mainfestData: mainfest
    })
  }

  filterDirs.forEach((folderName, index, list) => {
    let folderChildren = path.join(folderDir, '/', folderName)
    var files = fs.readdirSync(folderChildren)
    var jsFiles = files.filter((f) => {
      return f.endsWith('.js')
    }, files)

    let mainfest = {}
    let childrenPusher = async (ctx, next) => {
      next()
    }
    if (files.includes('mainfest.json')) {
      mainfest = require(path.join(folderChildren, '/mainfest.json'))
      childrenPusher = require('./http2-pusher')({
        mainfestData: mainfest
      })
    }

    for (var f of jsFiles) {
      logger.info(`process controller: ${f}...`)
      let mapping = require(path.join(folderChildren, '/', f))
      addViewMapping(router, mapping, glolbalPusher, childrenPusher)
    }
  })
}

module.exports = {
  addControllers,
  addViewControllers
}
