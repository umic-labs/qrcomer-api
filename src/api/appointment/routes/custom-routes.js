'use strict';

/**
 * service router.
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/workshops',
      handler: 'appointment.findWorkshops',
    },
  ]
}
