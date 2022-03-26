'use strict';

/**
 *  service controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::service.service', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;

    const query = { ...ctx.query, populate: ['lecture', 'meal'] }
    const service = await strapi.service('api::service.service').findOne(id, query);

    return service;
  },

  findByAttendee: async (ctx) => {
    const query = {
      ...ctx.query,
      populate: ['lecture', 'meal']
    }

    const { lecture, attendee, meal } = ctx.query

    const type = lecture && 'lecture' || meal && 'meal'
    const typeId = lecture && lecture || meal && meal

    const services = await strapi.service('api::service.service')
      .findServicesByAttendee({ type, typeId, attendee, query });

    return services;
  },

  async updatePresence(ctx) {
    const query = {
      ...ctx.query,
      populate: ['lecture', 'meal']
    }

    const { lecture, attendee, meal } = ctx.query

    const type = lecture && 'lecture' || meal && 'meal'
    const typeId = lecture && lecture || meal && meal
    
    const response = await strapi.service('api::service.service')
      .updatePresence({ type, typeId, attendee, query });

    return response;
  }
}));
