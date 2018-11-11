/**
 * Send Email
 * https: //www.npmjs.com/package/nodemailer
 * https: //nodemailer.com/smtp/proxies/ proxy socks
 */

const nodeMailer = require('nodemailer')
const config = require('./../config')
const logger = require('./../lib/logger').logger

const transporter = nodeMailer.createTransport({
  service: 'QQ',
  auth: {
    user: config.email.qq.user,
    pass: config.email.qq.pass
  }
  // host: 'smtp.gmail.com',
  // port: 587,
  // secure: false, // true for 465, false for other ports
  // auth: {
  //   type: 'OAuth2',
  //   user: config.email.user, // generated ethereal user
  //   clientId: config.email.clientID,
  //   clientSecret: config.email.clientSecret,
  //   refreshToken: config.email.refreshToken,
  //   accessToken: config.email.accessToken
  // },
  // proxy: 'socks5://192.168.2.132:1086'
})
// transporter.set('proxy_socks_module', require('socks'))
/**
 * from address muse be same as auth.user
 */
const send = async (from, to, subject, text, html, callback) => {
  const message = {
    from,
    to,
    subject,
    text,
    html
  }
  let res = await new Promise((resolve, reject) => {
    transporter.sendMail(message, (error, info) => {
      if (error) {
        logger.error(error)
        return reject(error)
      }
      logger.info(`Message send ${info}`)
      logger.info(`Preview URL ${nodeMailer.getTestMessageUrl(info)}`)
      return resolve(null)
    })
  })
  callback && callback(res)
  return res
}

module.exports = send
