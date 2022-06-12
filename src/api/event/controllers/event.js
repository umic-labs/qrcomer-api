'use strict';

/**
 *  event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;

    const query = {
      ...ctx.query,
      where: { id },
      populate: ['tickets', 'thumbnail']
    };

    const service = await strapi.db.query("api::event.event").findOne(query);
    return this.transformResponse(service);
  },
}));
