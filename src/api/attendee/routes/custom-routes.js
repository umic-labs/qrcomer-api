'use strict';

/**
 * service router.
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/attendees/:code',
      handler: 'attendee.findOne',
    }
  ]
}
