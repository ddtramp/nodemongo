const logger = require('./logger').logger
const listener = require('mongodb').instrument({
  operationIdGenerator: {
    operationId: 1,

    next: function () {
      return this.operationId++
    }
  },

  timestampGenerator: {
    current: function () {
      return new Date().getTime()
    },

    duration: function (start, end) {
      return end - start
    }
  }
}, function (err, instrumentations) {
  if (err) {
    console.error(err, {
      instrumentations
    })
  }
})

listener.on('started', function (event) {
  logger.info('mongodb start', event)
  // command start event (see https://github.com/mongodb/specifications/blob/master/source/command-monitoring/command-monitoring.rst)
})

listener.on('succeeded', function (event) {
  logger.info('operation was successed', event)
  // command success event (see https://github.com/mongodb/specifications/blob/master/source/command-monitoring/command-monitoring.rst)
})

listener.on('failed', function (event) {
  logger.error('Operations was failed', event)
  // command failure event (see https://github.com/mongodb/specifications/blob/master/source/command-monitoring/command-monitoring.rst)
})
