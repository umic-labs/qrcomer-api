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

    const { code } = ctx.params;

    const services = await strapi.service('api::service.service')
      .findServicesByAttendee({ code, query });

    return services;
  },

  async updatePresence(ctx) {
    const query = {
      ...ctx.query,
      populate: ['lecture']
    }
    
    const response = await strapi.service('api::service.service')
      .updatePresence(ctx.params.id, { query });

    return response;
  }
}));
