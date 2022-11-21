'use strict';

/**
 *  purchase controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::purchase.purchase', ({ strapi }) => ({
  async create(ctx) {
    const { data } = await super.create(ctx);
    
    const result = await strapi.db.query('api::purchase.purchase').findOne({
      where: { id: data.id },
      populate: ['attendees']
    });

    return this.transformResponse(result);
  }
}));
