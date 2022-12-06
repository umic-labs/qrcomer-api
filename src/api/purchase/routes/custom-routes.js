'use strict';

/**
 * service router.
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/purchases/preference/:preferenceId',
      handler: 'purchase.findByPreference',
    },
    {
      method: 'PUT',
      path: '/purchases/:preferenceId/feedback',
      handler: 'purchase.feedback',
    },
  ]
}
