const fs = require('fs')
const path = require('path')
const logger = require('./logger').logger
function addMapping (router, mapping) {
  for (var url in mapping) {
    if (url.startsWith('GET ')) {
      var path = url.substring(4)
      router.get(path, mapping[url])
      logger.info(`register URL mapping: GET ${path}`)
    } else if (url.startsWith('POST ')) {
      let path = url.substring(5)
      router.post(path, mapping[url])
      logger.info(`register URL mapping: POST ${path}`)
    } else if (url.startsWith('PUT ')) {
      let path = url.substring(4)
      router.put(path, mapping[url])
      logger.info(`register URL mapping: PUT ${path}`)
    } else if (url.startsWith('DELETE ')) {
      let path = url.substring(7)
      router.del(path, mapping[url])
      logger.info(`register URL mapping: DELETE ${path}`)
    } else {
      logger.error(`invalid URL: ${url}`)
    }
  }
}

function addControllers (router) {
  let folderDir = path.join(__dirname, './../controllers')
  let dirs = fs.readdirSync(folderDir)
  dirs.forEach((folderName, index, list) => {
    let folderChildren = path.join(folderDir, '/', folderName)
    var files = fs.readdirSync(folderChildren)
    var jsFiles = files.filter((f) => {
      return f.endsWith('.js')
    }, files)

    for (var f of jsFiles) {
      logger.info(`process controller: ${f}...`)
      let mapping = require(path.join(folderChildren, '/', f))
      addMapping(router, mapping)
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
