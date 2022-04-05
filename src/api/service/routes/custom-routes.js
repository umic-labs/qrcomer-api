'use strict';

/**
 * service router.
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/services',
      handler: 'service.findMany',
    },
    {
      method: 'PATCH',
      path: '/services',
      handler: 'service.redeem',
    }
  ]
}
