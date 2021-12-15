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
    }
  ]
}
