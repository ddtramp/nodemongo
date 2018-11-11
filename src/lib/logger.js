/**
 * Record message to mongodb
 * winston
 * https: //github.com/winstonjs/winston/blob/master/docs/transports.md#mongodb-transport
 */

const Winston = require('winston')
require('winston-mongodb')
require('winston-daily-rotate-file')
const config = require('./../config')

// TODO  config file, custom Logger
const MongoDb = new Winston.transports.MongoDB({
  level: 'error',
  silent: false,
  db: `mongodb://${config.mongo.user}:${config.mongo.passwd}@${config.mongo.host}:${config.mongo.port}/db-logs`,
  options: {
    useNewUrlParser: true
  },
  collection: 'log',
  storeHost: 'localhost:8001',
  username: 'test',
  password: 'test',
  label: 'lalala...',
  name: 'mongodbLog',
  capped: true,
  cappedSize: 10000000,
  cappedMax: 100000000,
  tryReconnect: true
})

let logger = Winston.createLogger({
  level: 'info',
  format: Winston.format.json(),
  transports: [
    new Winston.transports.Console(), // print log to console
    // new Winston.transports.File({
    //   filename: 'combined.log'
    // })
    new (Winston.transports.DailyRotateFile)({
      dirname: './../logs',
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    }),
    MongoDb
  ]
})
module.exports = {
  logger
}
