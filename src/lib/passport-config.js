// https://www.npmjs.com/package/koa-passport
// TODO koa-passwword does not work with external session storage
// https://github.com/rkusa/koa-passport/issues

const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('./db').getDb()
const crypt = require('./crypto')
const ObjectId = require('mongodb').ObjectID

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    let user = await db.collection('users').findOne({
      email: username
    })
    if (!user) {
      return done(null, false, {
        message: 'Incorrect username.'
      })
    }
    if (!await crypt.compare(password, user.password)) {
      return done(null, false, {
        message: 'Incorrect password.'
      })
    }
    return done(null, user)
  } catch (e) {
    return done(e)
  }
}))

passport.serializeUser(function (user, done) {
  done(null, user._id)
})

passport.deserializeUser(async function (id, done) {
  console.log('id, ', id)
  try {
    let user = await db.collection('users').findById({
      _id: ObjectId(id)
    })
    console.log('user: %s', user)
    done(null, user)
  } catch (e) {
    done(e, null)
  }
})

module.exports = passport
