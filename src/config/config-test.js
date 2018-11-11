// TODO key & iv should be hex
const config = {
  mongo: {
    user: 'test',
    passwd: 'test',
    host: 'mongodb_mongo_1_5a38c689f6ca',
    port: 27017,
    poolSize: 100,
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
    key: '7468697320697320612074c3a97374', // this is a tést
    saltRounds: 10
  },
  jwt: {
    secret: 'jwttoken_lalala...'
  },
  /**
   * https://stackoverflow.com/questions/48854066/missing-credentials-for-plain-nodemailer
   * https://www.youtube.com/watch?v=JJ44WA_eV8E
   * https://console.cloud.google.com/apis/credentials/oauthclient/665535578572-nrarep2gtilruj72tcsvj8sg1b7qcg4p.apps.googleusercontent.com?project=refined-ensign-222103
   * https://developers.google.com/oauthplayground/?code=4/kQBHcx5YJVWm6DJ4BIOy8lNCfF6lLweV7TiSyCsAQWQnqbN8sXPDiZDiCNHRP6NFkph7eVLClhtw7pr6bQVlHO4&scope=https://mail.google.com/
   */
  email: {
    type: 'Gmail',
    user: 'wangxichao001@gmail.com',
    passs: 'abs122825618',
    clientID: '665535578572-nrarep2gtilruj72tcsvj8sg1b7qcg4p.apps.googleusercontent.com',
    clientSecret: 'Guid2acg6yiV7Cy6VtnSB11-',
    refreshToken: '1/GZv59TPyW-tRZf_dI0ZCYeyX9XhvZTCrQSZKZ-kb2Mo',
    accessToken: 'ya29.GltQBrGS2ugpe54Y0p0HqNzovfrt3KRaltfLa6bDpnMfBH9ChyY5ZRPIaarV7jBidmF-WTyGhYsFMCoEHlzGvCSZmeOvfzFckIuNUw-Qy0Yuq8R8_DuJR3UzFgL-',
    qq: {
      user: '122825619@qq.com',
      pass: 'xxgpyioyggspcbbg'
    }
  }
}

module.exports = config
