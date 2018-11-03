/**
 * https: //httpwg.org/specs/rfc7540.html#rfc.section.8.1.3
 * https: //www.npmjs.com/package/koa-h2-man-pusher
 */

const path = require('path')
const url = require('url')
const zlib = require('zlib')
const mime = require('mime')
const fs = require('fs')
const logger = require('./logger').logger

function middleware (opts = {}) {
  const options = Object.assign({
    manifest: 'manifest.json',
    datmainfestDataa: null, // object
    root: '.'
  }, opts)

  const manifest = options.mainfestData || require(path.resolve(options.root, options.manifest))
  return async (ctx, next) => {
    const { host, protocol } = ctx

    // if (req.url !== '/') {
    //   return next()
    // }

    function push (key) {
      const popts = {
        status: 200, // optional
        method: 'GET', // optional
        priority: manifest[key].priority,
        request: {
          accept: '*/*'
        },
        response: {
          'content-type': mime.getType(key) + '; charset=utf-8',
          'Content-Encoding': 'gzip'
        }
      }

      const stream = ctx.res.push(key, popts)
      const outContent = fs.createReadStream(path.resolve(options.root, key.slice(1)))
      outContent.pipe(zlib.createGzip()).pipe(stream)

      stream.on('error', function (error) {
        logger.error('ctx.res.push error', error)
      })
      stream.on('close', () => {
        logger.info('stream close')
      })
      stream.on('finish', (cleanup) => {
        logger.info('stream finish')
      })

      return stream
    }

    const links = Object.keys(manifest).map(key => {
      const type = manifest[key].type
      const u = new url.URL(`${protocol}://${host}${key}`)
      return `<${u}>; rel=preload; as=${type}`
    })

    let link = ctx.response.header.link || ''
    ctx.set('Link', link + ',' + links.join(', '))

    Object.keys(manifest).forEach(push)
    await next()
  }
}

module.exports = middleware
