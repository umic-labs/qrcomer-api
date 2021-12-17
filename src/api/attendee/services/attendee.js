'use strict';

/**
 * attendee service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::attendee.attendee', ({ strapi }) => ({
  async create(params) {

    const result = await super.create(params);

    const lectures = await strapi.db.query('api::lecture.lecture').findMany()

    lectures.map((lecture) => {
      strapi.db.query('api::service.service').create({
        data: {
          present: false,
          lecture: lecture.id,
          attendee: result.id
        }
      })
    })

    return result;
  }
}));
