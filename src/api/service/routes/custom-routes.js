'use strict';

/**
 * service router.
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/attendees/:attendeeId/services',
      handler: 'service.findByAttendee',
    },
    {
      method: 'PATCH',
      path: '/attendees/:attendeeId/services/:id',
      handler: 'service.updatePresence',
    }
  ]
}
