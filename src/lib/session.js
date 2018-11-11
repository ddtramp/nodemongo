/**
 * https: //www.npmjs.com/package/koa-session2
 */

const Session = require('koa-session2')
const Store = require('./Store.js')

const session = Session({
  key: 'sessionId',
  store: new Store()
})
module.exports = session
