'use strict';

/**
 *  attendee controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::attendee.attendee', ({ strapi }) =>  ({
  async findOne(ctx) {
    const { code } = ctx.params;

    const query = {
      ...ctx.query,
      populate: [
        'services',
        'services.appointment',
      ]
    }
    
    const service = await strapi.db.query('api::attendee.attendee').findOne({
      where: { code },
      ...query
    });

    return service;
  },

  async find(ctx) {
    const query = { ...ctx.query }
    const services = await strapi.service('api::attendee.attendee').find(query);

    return services;
  },
}))
