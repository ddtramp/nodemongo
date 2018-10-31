const fs = require('fs')
const path = require('path')

function addMapping (router, mapping) {
  for (var url in mapping) {
    if (url.startsWith('GET ')) {
      var path = url.substring(4)
      router.get(path, mapping[url])
      console.log(`register URL mapping: GET ${path}`)
    } else if (url.startsWith('POST ')) {
      let path = url.substring(5)
      router.post(path, mapping[url])
      console.log(`register URL mapping: POST ${path}`)
    } else if (url.startsWith('PUT ')) {
      let path = url.substring(4)
      router.put(path, mapping[url])
      console.log(`register URL mapping: PUT ${path}`)
    } else if (url.startsWith('DELETE ')) {
      let path = url.substring(7)
      router.del(path, mapping[url])
      console.log(`register URL mapping: DELETE ${path}`)
    } else {
      console.log(`invalid URL: ${url}`)
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
      console.log(`process controller: ${f}...`)
      let mapping = require(path.join(folderChildren, '/', f))
      addMapping(router, mapping)
    }
  })
}

module.exports = {
  addControllers
}
