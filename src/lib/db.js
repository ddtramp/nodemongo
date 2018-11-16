const assert = require('assert')
const MongoClient = require('mongodb').MongoClient
// TODO open listener
// require('./db-listener')
const config = require('./../config')
const logger = require('./logger').logger

let _db
/**
 * start process
 */
const initDb = async (fn) => {
  if (_db) {
    console.warn('Trying to init DB again!')
    return fn(null, _db)
  }
  // Connection URL
  const url = `mongodb://${config.mongo.user}:${config.mongo.passwd}@${config.mongo.host}:${config.mongo.port}/${config.mongo.dbName}`
  // Database Name
  const dbName = config.mongo.dbName
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    poolSize: config.mongo.poolSize,
    loggerLevel: config.mongo.loggerLevel
  })

  try {
    // Use connect method to connect to the Server
    await client.connect()
    let db = client.db(dbName)
    _db = db
    fn && fn(null, db, client)
    return db
  } catch (err) {
    logger.error(err)
    fn(err, null, null)
    throw err
  }
}

const getDb = () => {
  assert.ok(_db, 'Db has not been initialized. Please called init first.')
  return _db
}
module.exports = {
  initDb,
  getDb
}
