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
  console.log('mongodb start', event)
  // command start event (see https://github.com/mongodb/specifications/blob/master/source/command-monitoring/command-monitoring.rst)
})

listener.on('succeeded', function (event) {
  console.log('operation was successed', event)
  // command success event (see https://github.com/mongodb/specifications/blob/master/source/command-monitoring/command-monitoring.rst)
})

listener.on('failed', function (event) {
  console.log('Operations was failed', event)
  // command failure event (see https://github.com/mongodb/specifications/blob/master/source/command-monitoring/command-monitoring.rst)
})
