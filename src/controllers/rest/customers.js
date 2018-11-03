const APIError = require('./../../lib/rest').APIError

module.exports = {
  'GET /api/customers': async (ctx, next) => {
    try {
      // TODO pagination
      let pageSize = 10
      let pageNo = 0
      let sort = 1
      let sortField = 'ID'
      let query = ctx.query
      pageNo = query.pageNo
      pageSize = query.pageSize
      sort = query.sort

      let data = await ctx.db.collection('customers').find({}, { limit: 10 }).toArray()

      ctx.logger.info('this is test logger info')
      ctx.logger.error('this is test logger error')

      ctx.rest(data)
    } catch (e) {
      ctx.logger.error('CUSTOMERS', e)
      throw new APIError('CUSTOMERS', 'get customers error')
    }
  }
}
