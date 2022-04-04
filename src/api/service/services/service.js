'use strict';

/**
 * service service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::service.service', ({ strapi }) => ({
  async findServicesByAttendee({ type, typeId, attendee, query }) {  

    const typeQuery = type && typeId && { [type]: { id: typeId } }

    const results = await strapi.db.query('api::service.service')
      .findMany({
        where: {
          attendee: { code: attendee },
          ...typeQuery,
        },
        ...query
      });

    return !typeQuery ? results : results[0]
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
  },

  async generateServicesByAppointment({ result }) {
    const appointments = await strapi.db.query('api::appointment.appointment').findMany()

    const services = appointments.map((appointment) => {
      appointment.isPublic && strapi.db.query('api::service.service').create({
        data: {
          present: false,
          appointment: appointment.id,
          attendee: result.id
        }
      })
    })
    
    return services;
  }
}));
