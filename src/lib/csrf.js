/**
 * Cross site request forgery
 * view and /web/* api use this
 * https: //www.npmjs.com/package/koa-csrf
 const token = bodyToken ||
   (!this.opts.disableQuery && ctx.query && ctx.query._csrf) ||
   ctx.get('csrf-token') ||
   ctx.get('xsrf-token') ||
   ctx.get('x-csrf-token') ||
   ctx.get('x-xsrf-token');
 */

const KoaCsrf = require('koa-csrf')
let csrfMiddleware = new KoaCsrf({
  invalidSessionSecretMessage: 'Invalid session secret',
  invalidSessionSecretStatusCode: 403,
  invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403,
  excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
  disableQuery: false
})

module.exports = csrfMiddleware
