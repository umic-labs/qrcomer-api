'use strict';

/**
 *  ticket controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::ticket.ticket", ({ strapi }) => ({
  async findByEvent(ctx) {
    const { eventId } = ctx.params;

    ctx.query = {
      ...ctx.query,
      filters: {
        event: {
          id: {
            $eq: eventId
          }
        },
      },
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    const { id, eventId } = ctx.params;
    const query = {
      ...ctx.query,
      where: {
        $and: [
          { id },
          { event: eventId }
        ]
      },
    };

    const service = await strapi.db.query("api::ticket.ticket").findOne(query);
    return this.transformResponse(service);
  },
}));
