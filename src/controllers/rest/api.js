const APIError = require('./../../lib/rest').APIError

module.exports = {
  /**
   * sign
   * @param ctx
   * @param next
   * @returns {Promise.<void>}
   * @constructor
   */
  'POST /api/signin': async (ctx, next) => {
    let name = ctx.request.body.name
    let passwd = ctx.request.body.passwd

    ctx.logger.info('Name: ' + name + ' | Passwd: ' + passwd)

    let user = {
      name: name || 'unknow',
      passwd: '****',
      CreatedAt: new Date()
    }
    ctx.rest({
      user
    })
  }
  // /**
  //  * get signin user info
  //  * @param ctx
  //  * @param next
  //  * @returns {Promise.<void>}
  //  * @constructor
  //  */
  // 'GET /api/getSignInUser': async (ctx, next) => {
  //     let user = ctx.session.user;    // get SESSION
  //     console.log(user);
  //     if (user) {
  //         ctx.rest(user);
  //     } else {
  //         throw new APIError('user:not_found', 'user not sign in.');
  //     }
  // },
  // 'GET /api/products': async (ctx, next) => {
  //     ctx.rest({
  //         products: products.getProducts()
  //     });
  // },

  // 'POST /api/products': async (ctx, next) => {
  //     var p = products.createProduct(ctx.request.body.name, ctx.request.body.manufacturer, parseFloat(ctx.request.body.price));
  //     ctx.rest(p);
  // },

  // 'DELETE /api/products/:id': async (ctx, next) => {
  //     console.log(`delete product ${ctx.params.id}...`);
  //     var p = products.deleteProduct(ctx.params.id);
  //     if (p) {
  //         ctx.rest(p);
  //     } else {
  //         throw new APIError('product:not_found', 'product not found by id.');
  //     }
  // }
}
