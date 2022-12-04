'use strict';

/**
 * service router.
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/purchases/create_preference',
      handler: 'purchase.createPreference',
    }
  ]
}
