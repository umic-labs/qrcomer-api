'use strict';

/**
 *  lecture controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::lecture.lecture', ({ strapi }) =>  ({
  async find(ctx) {
    const query = { ...ctx.query }
    const services = await strapi.service('api::lecture.lecture').find(query);

    return services.results;
  },
}))