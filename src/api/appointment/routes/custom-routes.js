'use strict';

/**
 * service router.
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/lectures',
      handler: 'appointment.findLectures',
    },
    {
      method: 'GET',
      path: '/meals',
      handler: 'appointment.findMeals',
    },
    {
      method: 'GET',
      path: '/workshops',
      handler: 'appointment.findWorkshops',
    },
    {
      method: 'GET',
      path: '/lectures/:id',
      handler: 'appointment.findOne',
    },
    {
      method: 'GET',
      path: '/meals/:id',
      handler: 'appointment.findOne',
    },
    {
      method: 'GET',
      path: '/workshops/:id',
      handler: 'appointment.findOne',
    },
  ]
}
