const CryptoJS = require('crypto-js')
const config = require('./../config')
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

module.exports = {
  aesEncrypt,
  aesDecrypt,
  sha1
}
