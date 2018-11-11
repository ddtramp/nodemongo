const MongoClient = require('mongodb').MongoClient
const Acl = require('acl')
const crypto = require('../lib/crypto')
const dbName = process.argv[2].toString();

(async () => {
  const url = 'mongodb://test:test@mongodb_mongo_1_5a38c689f6ca:27017/' + dbName
  // Database Name
  const client = new MongoClient(url, {
    useNewUrlParser: true
  })

  try {
    await client.connect()
    const db = client.db(dbName)
    const mongoBackend = new Acl.mongodbBackend(db, 'acl_') // eslint-disable-line
    const acl = new Acl(mongoBackend)

    // TODO only for rpc
    await acl.allow('guest', '/reset', 'get')
    await acl.allow('guest', '/reset.html', 'get')
    await acl.allow('guest', '/register.html', 'get')

    client.close()
    process.exit(0)
  } catch (err) {
    console.error(err.stack)
  }
})()
