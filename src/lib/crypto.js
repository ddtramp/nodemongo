/**
 * can not install bcrypt
 * https: //stackoverflow.com/questions/29320201/error-installing-bcrypt-with-npm
 */

const CryptoJS = require('crypto-js')
const config = require('./../config')
const bcrypt = require('bcryptjs')


/**
 * encrypt
 * ! same string, encrypt twice got different result
 * @param {*} data
 */
function aesEncrypt (data) {
  let crypted = CryptoJS.AES.encrypt(data.toString() + config.crypto.salt.toString(), CryptoJS.enc.Hex.parse(config.crypto.key))
  return crypted
}

function aesDecrypt (encrypted) {
  let decrypted = CryptoJS.AES.decrypt(encrypted.toString(), CryptoJS.enc.Hex.parse(config.crypto.key))
  return decrypted
}

function sha1 (data) {
  return CryptoJS.SHA1(data + config.crypto.salt)
}

/**
 * bcrypt hash
 */
const hash = async (str, saltRounds = config.crypto.saltRounds) => {
  return bcrypt.hash(str, saltRounds)
}
/**
 * bcrypt compare
 */
const compare = async (str, hash) => {
  return bcrypt.compare(str, hash)
}

module.exports = {
  aesEncrypt,
  aesDecrypt,
  sha1,
  hash,
  compare,
  bcrypt
}
