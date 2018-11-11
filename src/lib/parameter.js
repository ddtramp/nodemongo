/**
 * validate module
 * https: //www.npmjs.com/package/parameter
 */
const Parameter = require('parameter')

const validator = new Parameter({
  // translate: function () {
  // TODO I18n
  //   var args = Array.prototype.slice.call(arguments);
  //   // Assume there have I18n.t method for convert language.
  //   return I18n.t.apply(I18n, args)
  // },
  validateRoot: true // restrict the being validate value must be a object
})

module.exports = validator
