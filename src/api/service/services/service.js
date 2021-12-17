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

  async updatePresence({ type, typeId, attendee, query }) {
    const result = await strapi.query('api::service.service')
      .update({
        where: {
          attendee: { code: attendee },
          [type]: { id: typeId },
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
          type: 'lecture',
          lecture: lecture.id,
          attendee: result.id
        }
      })
    })

    return services;
  },

  async generateServicesByMeals({ result }) {
    const meals = await strapi.db.query('api::meal.meal').findMany()

    const services = meals.map((meal) => {
      strapi.db.query('api::service.service').create({
        data: {
          present: false,
          type: 'meal',
          meal: meal.id,
          attendee: result.id
        }
      })
    })

    return services;
  }
}));
