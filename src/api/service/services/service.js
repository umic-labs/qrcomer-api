'use strict';

/**
 * service service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::service.service', ({ strapi }) => ({
  async findOneByAttendee({ appointment, attendee, query }) {
    const result = await strapi.db.query('api::service.service')
      .findOne({
        where: {
          $and: [
            {
              attendee: { code: attendee },
            },
            {
              appointment,
            }
          ]
        },
        ...query
      });

    return result
  },

  async findManyByAttendee({ attendee, query }) {
    const results = await strapi.db.query('api::service.service')
      .findMany({
        where: {
          attendee: { code: attendee },
        },
        ...query
      });

    return results
  },

  async redeem({ appointment, attendee, query }) {
    const result = await strapi.query('api::service.service')
      .update({
        where: {
          attendee: { code: attendee },
          appointment,
        }, 
        data: { isRedeemed: true },
        ...query
      })

    return result;
  },

  async generateServicesByAppointment({ attendee }) {
    const appointments = await strapi.db.query('api::appointment.appointment')
    .findMany()

    const lectures = attendee.hasLectures
      ? composeAppointmentsByType({ appointments, type: 'lecture' })
      : []
    
    const meals = attendee.hasMeals
      ? composeAppointmentsByType({ appointments, type: 'meal' })
      : []
        
    const appointmentsToCreate = [...lectures, ...meals]
  
    const services = appointmentsToCreate.map((appointment) => {
      strapi.db.query('api::service.service').create({
        data: {
          appointment: appointment.id,
          attendee: attendee.id
        }
      })
    })

    return services
  }
}))

const composeAppointmentsByType = ({ appointments, type }) => {
  return appointments.filter((appointment) => appointment.type === type)
}
