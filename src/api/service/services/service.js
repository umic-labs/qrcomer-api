'use strict';

/**
 * service service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::service.service', ({ strapi }) => ({
  async findServicesByAttendee({ id }) {  
    const results = await strapi.db.query('api::service.service')
      .findMany({
        where: {
          attendee: { id }
        }
      });

    return results
  },
}));
