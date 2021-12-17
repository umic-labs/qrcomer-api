'use strict';

/**
 * service service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::service.service', ({ strapi }) => ({
  async findServicesByAttendee({ code, query }) {  

    const results = await strapi.db.query('api::service.service')
      .findMany({
        where: {
          attendee: { code }
        },
        ...query
      });

    return results
  },

  async updatePresence(entityId, { query }) {
    const result = await strapi.query('api::service.service')
      .update({
        where: { id: entityId }, 
        data: { present: true },
        ...query
      })

    return result;
  }
}));
