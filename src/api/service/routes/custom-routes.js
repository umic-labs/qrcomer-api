'use strict';

/**
 * service router.
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/attendees/:code/services',
      handler: 'service.findByAttendee',
    },
    {
      method: 'PATCH',
      path: '/attendees/:code/services/:id',
      handler: 'service.updatePresence',
    }
  ]
}
