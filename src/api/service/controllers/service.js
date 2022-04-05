'use strict';

/**
 *  service controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::service.service', ({ strapi }) => ({
  findMany: async (ctx) => {
    const query = {
      ...ctx.query,
      populate: ['appointment']
    }

    const { attendee, appointment } = ctx.query

    const services = !!appointment
      ? await strapi.service('api::service.service').findOneByAttendee({ appointment, attendee, query })
      : await strapi.service('api::service.service').findManyByAttendee({ attendee, query })

    return services;
  },

  async redeem(ctx) {
    const query = {
      ...ctx.query,
      populate: ['appointment']
    }

    const { appointment, attendee } = ctx.query
    
    const response = await strapi.service('api::service.service')
      .redeem({ appointment, attendee, query });

    return response;
  }
}));
