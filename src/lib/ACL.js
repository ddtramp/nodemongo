/**
 * rewrite acl middleware
 * https: //github.com/OptimalBits/node_acl/blob/master/lib/acl.js
 */

const Acl = require('acl')

/**
  koa2 Middleware
*/
Acl.prototype.middlewareKoa2 = function (numPathComponents, userId, actions) {
  var acl = this

  function HttpError (errorCode, msg) {
    this.status = errorCode
    this.message = msg
    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)
    this.constructor.prototype = Error.prototype
  }

  return async (ctx, next) => {
    let _userId = userId
    let _actions = actions
    let resource
    let url
    let req = ctx.request
    let res = ctx.response

    // call function to fetch userId
    if (typeof userId === 'function') {
      _userId = userId(req, res)
    }
    if (!userId) {
      if ((req.session) && (req.session.userId)) {
        _userId = req.session.userId
      } else if ((req.user) && (req.user.id)) {
        _userId = req.user.id
      } else {
        next(new HttpError(401, 'User not authenticated'))
        return
      }
    }

    // Issue #80 - Additional check
    if (!_userId) {
      next(new HttpError(401, 'User not authenticated'))
      return
    }

    url = req.originalUrl.split('?')[0]
    if (!numPathComponents) {
      resource = url
    } else {
      resource = url.split('/').slice(0, numPathComponents + 1).join('/')
    }

    if (!_actions) {
      _actions = req.method.toLowerCase()
    }

    acl.logger ? acl.logger.debug('Requesting ' + _actions + ' on ' + resource + ' by user ' + _userId) : null

    let allowed = await acl.isAllowed(_userId, resource, _actions)
    if (allowed === false) {
      if (acl.logger) {
        acl.logger.debug('Not allowed ' + _actions + ' on ' + resource + ' by user ' + _userId)
        acl.allowedPermissions(_userId, resource, function (err, obj) {
          acl.logger.debug('Allowed permissions: ' + util.inspect(obj))
        })
      }
      throw new HttpError(403, 'Not allowed ' + _actions + ' on ' + resource + ' by user ' + _userId)
      return next()
    } else {
      acl.logger ? acl.logger.debug('Allowed ' + _actions + ' on ' + resource + ' by user ' + _userId) : null
      return next()
    }
  }
}

/**
  Error handler for the Express middleware

  @param {String} [contentType] (html|json) defaults to plain text
*/
Acl.prototype.middlewareKoa2.errorHandler = function (contentType) {
  var method = 'end'

  if (contentType) {
    switch (contentType) {
      case 'json':
        method = 'json'
        break
      case 'html':
        method = 'send'
        break
    }
  }

  return function (err, req, res, next) {
    if (err.name !== 'HttpError' || !err.errorCode) return next(err)
    res.status(err.errorCode)[method](err.message)
  }
}

module.exports = Acl
