'use strict';

/**
 *  event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  async findOne(ctx) {
    const query = {
      ...ctx.query,
      populate: ['tickets', 'thumbnail']
    };

    const service = await strapi.db.query("api::event.event").findOne(query);
    return this.transformResponse(service);
  },
}));
