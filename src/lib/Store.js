/**
 * Created by jack on 08/05/2017.
 */
const Redis = require('ioredis')
const uid = require('uid-safe')
const { Store } = require('koa-session2')

const config = require('./../config')

class RedisStore extends Store {
  constructor () {
    super()
    this.redis = new Redis({ // connect to redis server
      ...config.redis
    })
  }

  getID (length) {
    return uid.sync(length) // 生成id
  }

  async get (sid) {
    let data = await this.redis.get(`SESSION:${sid}`)
    return JSON.parse(data)
  }

  async set (session, { sid = this.getID(24), maxAge = 1000000 } = {}) {
    try {
      // Use redis set EX to automatically drop expired sessions
      await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge / 1000)
    } catch (e) {}
    return sid
  }

  async destroy (sid) {
    return await this.redis.del(`SESSION:${sid}`) // eslint-disable-line
  }
}

module.exports = RedisStore
