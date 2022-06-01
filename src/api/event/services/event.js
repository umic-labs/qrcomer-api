'use strict';

/**
 * event service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService("api::event.event", ({ strapi }) => ({
  async findOne(entityId, params = {}) {
    params = {
      ...params,
      populate: {
        tickets: true,
        thumbnail: {
          fields: ['url', 'name']
        }
      }
    }

    return strapi.entityService.findOne(
      "api::event.event",
      entityId,
      this.getFetchParams(params)
    );
  },
}));