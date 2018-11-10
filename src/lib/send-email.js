/**
 * Send Email
 *
 */

const nodeMailer = require('nodemailer')
const config = require('./../config')
const logger = require('./../lib/logger').logger

const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.user, // generated ethereal user
    pass: config.email.pass // generated ethereal password
  }
})

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
      console.log('----------------- send email ------------------')
      if (error) {
        logger.error(error)
        return reject(error)
      }
      console.log(info)
      logger.info('Message send %s', info.messageId)
      logger.info('Preview URL %s', nodeMailer.getTestMessageUrl(info))
      return resolve(null)
    })
  })
  callback && callback(res)
  return res
}

module.exports = send
