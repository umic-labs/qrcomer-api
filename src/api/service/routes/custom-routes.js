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
      method: 'GET',
      path: '/services/appointment/:appointment',
      handler: 'service.findOne',
    },
    {
      method: 'PATCH',
      path: '/services',
      handler: 'service.redeem',
    }
  ]
}
