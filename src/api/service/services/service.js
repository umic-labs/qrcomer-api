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

  async updatePresence({ lecture, attendee, query }) {
    const result = await strapi.query('api::service.service')
      .update({
        where: {
          attendee: { code: attendee },
          lecture: { id: lecture }
        }, 
        data: { present: true },
        ...query
      })

    return result;
  },

  async generateServicesByLectures({ result }) {
    const lectures = await strapi.db.query('api::lecture.lecture').findMany()

    const services = lectures.map((lecture) => {
      strapi.db.query('api::service.service').create({
        data: {
          present: false,
          lecture: lecture.id,
          attendee: result.id
        }
      })
    })

    return services;
  }
}));
