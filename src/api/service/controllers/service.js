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

    const { attendee } = ctx.query;

    const services = await strapi.service('api::service.service')
      .findServicesByAttendee({ code: attendee, query });

    return services;
  },

  async updatePresence(ctx) {
    const query = {
      ...ctx.query,
      populate: ['lecture']
    }

    const { lecture, attendee } = ctx.query
    
    const response = await strapi.service('api::service.service')
      .updatePresence({ lecture, attendee, query });

    return response;
  }
}));
