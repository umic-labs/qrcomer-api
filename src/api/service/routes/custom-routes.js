'use strict';

/**
 * service router.
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/services',
      handler: 'service.findByAttendee',
    },
    {
      method: 'PATCH',
      path: '/services',
      handler: 'service.updatePresence',
    }
  ]
}
