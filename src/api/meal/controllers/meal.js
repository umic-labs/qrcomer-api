'use strict';

/**
 *  meal controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::meal.meal', ({ strapi }) =>  ({
  async find(ctx) {
    const query = { ...ctx.query }
    const services = await strapi.service('api::meal.meal').find(query);

    return services.results;
  },
}))