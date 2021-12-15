'use strict';

/**
 *  service controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::service.service', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;

    const query = { ...ctx.query, populate: ['lecture'] }
    const service = await strapi.service('api::service.service').findOne(id, query);

    return service;
  },

  findByAttendee: async (ctx) => {
    const query = {
      ...ctx.query,
      populate: ['lecture']
    }

    const { attendeeId } = ctx.params;

    const services = await strapi.service('api::service.service')
      .findServicesByAttendee({ attendeeId, query });

    return services;
  },

  async updatePresence(ctx) {
    console.log(ctx.params.id)

    const query = {
      ...ctx.query,
      populate: ['lecture']
    }
    
    const response = await strapi.service('api::service.service')
      .updatePresence(ctx.params.id, { query });

    return response;
  }
}));
