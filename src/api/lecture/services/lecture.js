'use strict';

/**
 * lecture service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::lecture.lecture');
