const MongoClient = require('mongodb').MongoClient
// TODO open listener
// require('./db-listener')
const config = require('./../config')

/**
 * start process
 */
const startProcess = async (fn) => {
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
    fn && fn(db)
  } catch (err) {
    console.log('============== mongodb connect error ===============')
    throw err
  }
}

module.exports = {
  init: startProcess
}
