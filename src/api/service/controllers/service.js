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

  async find(ctx) {
    const query = { ...ctx.query, populate: ['lecture'] }
    const services = await strapi.service('api::service.service').find(query);

    return services;
  }
}));
