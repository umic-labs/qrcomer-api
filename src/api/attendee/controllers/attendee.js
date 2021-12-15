'use strict';

/**
 *  attendee controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::attendee.attendee', ({ strapi }) =>  ({
  async findOne(ctx) {
    const { id } = ctx.params;

    const query = { ...ctx.query, populate: ['services', 'services.lecture'] }
    const service = await strapi.service('api::attendee.attendee').findOne(id, query);

    return service;
  },

  async find(ctx) {
    const query = { ...ctx.query }
    const services = await strapi.service('api::attendee.attendee').find(query);

    return services;
  }
}))
