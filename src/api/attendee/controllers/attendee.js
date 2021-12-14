'use strict';

/**
 *  attendee controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::attendee.attendee', ({ strapi }) =>  ({
  async findOne(ctx) {
    ctx.query = { ...ctx.query, local: 'en' }
    const { id } = ctx.params

    const { data, meta } = await super.findOne(ctx);
    const services = await strapi.service('api::service.service')
      .getServicesByAttendee({ id });
    const sanitizedServices = await this.sanitizeOutput(services, ctx);
    data.attributes.services = this.transformResponse(sanitizedServices)

    return { data, meta };
  },
}))
