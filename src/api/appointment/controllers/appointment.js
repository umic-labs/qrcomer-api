'use strict';

/**
 *  appointment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::appointment.appointment', ({ strapi }) => ({
  findWorkshops: async (ctx) => {
    const query = {
      ...ctx.query,
      populate: ['appointment']
    }

    const services = await strapi.service('api::appointment.appointment')
      .findByType({ type: 'workshop', query });

    return services;
  },

  findMeals: async (ctx) => {
    const query = {
      ...ctx.query,
      populate: ['appointment']
    }

    const services = await strapi.service('api::appointment.appointment')
      .findByType({ type: 'meal', query });

    return services;
  },

  findMeals: async (ctx) => {
    const query = {
      ...ctx.query,
      populate: ['appointment']
    }

    const services = await strapi.service('api::appointment.appointment')
      .findByType({ type: 'meal', query });

    return services;
  },

  findLectures: async (ctx) => {
    const query = {
      ...ctx.query,
      populate: ['appointment']
    }

    const services = await strapi.service('api::appointment.appointment')
      .findByType({ type: 'lecture', query });

    return services;
  },
}));
