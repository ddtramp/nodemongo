// TODO key & iv should be hex
const config = {
  mongo: {
    user: 'test',
    passwd: 'test',
    host: 'mongodb_mongo_1',
    port: 27017,
    poolSize: 5,
    loggerLevel: 'error', // error/warn/info/debug
    dbName: 'db-dev'
  },
  redis: {
    port: 6379, // Redis port
    host: 'node-redis-server', // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: 'root',
    db: 0
  },
  crypto: {
    salt: 'this is crypto salt',
    key: '7468697320697320612074c3a97374' // this is a tést
  }
}

module.exports = config
