'use strict';

/**
 * attendee router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::attendee.attendee', {
  except: ['findOne']
});
