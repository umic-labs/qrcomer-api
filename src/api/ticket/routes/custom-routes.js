'use strict';

/**
 * service router.
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/events/:eventId/tickets',
      handler: 'ticket.findByEvent',
    },
    {
      method: 'GET',
      path: '/events/:eventId/tickets/:id',
      handler: 'ticket.findOne',
    }
  ]
}
