'use strict';

/**
 * appointment service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::appointment.appointment', ({ strapi }) => ({
  async findByType({ type, query }) {  

    const results = await strapi.db.query('api::appointment.appointment')
      .findMany({
        where: {
          type
        },
        ...query
      });

    return results
  }
}));