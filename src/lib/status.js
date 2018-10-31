const os = require('os')
const exec = require('child_process').exec
const async = require('async')
let started_at = new Date()

// TODO port test

module.exports = async (ctx, next) => {
  let req = ctx.request
  let res = ctx.response
  var server = ctx.app
  if (ctx.query.info) {
    var connections = {},
      swap
    await async.parallel([
      async function (done) {
        exec('netstat -an | grep : 27017 | wc -l', function (e, res) {
          console.log(e)
          connections['27017'] = parseInt(res, 10)
          done()
        })
      },
      async function (done) {
        exec('netstat -an | grep : 3000 | wc -l',
          function (e, res) {
            connections[3000] = parseInt(res, 10)
            done()
          })
      },
      async function (done) {
        exec('vmstat -SM -s | grep "used swap" | sed -E "s/[^0-9]*([0-9]{1,8}).*/\1/"',
          function (e, res) {
            swap = res
            done()
          })
      }
    ], function (e) {
      ctx.response.type = 'application/json'
      let body = {
        status: 'up',
        version: '1.0.0',
        sha: 'sha 123',
        started_at: started_at,
        node: {
          version: process.version,
          memoryUsage: Math.round(process.memoryUsage().rss / 1024 / 1024) + "M",
          uptime: process.uptime()
        },
        system: {
          loadavg: os.loadavg(),
          freeMemory: Math.round(os.freemem() / 1024 / 1024) + "M"
        },
        env: process.env.NODE_ENV,
        hostname: os.hostname(),
        connections: connections,
        swap: swap
      }
      ctx.response.body = body
      next()
    })
  } else {
    ctx.response.type = 'application/json'
    ctx.response.body = ({
      status: 'up'
    })
    await next()
  }
}
